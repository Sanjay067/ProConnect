import mongoose from "mongoose";
import Conversation, { makeParticipantKey } from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/users.model.js";
import { pushNotification } from "../services/notification.service.js";

export const openOrCreateConversation = async (req, res) => {
  try {
    const { userId: otherId } = req.body;
    if (!otherId || String(otherId) === String(req.user._id)) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const other = await User.findById(otherId);
    if (!other) return res.status(404).json({ message: "User not found" });

    const key = makeParticipantKey(req.user._id, otherId);
    let conv = await Conversation.findOne({ participantKey: key });
    if (!conv) {
      conv = await Conversation.create({
        participantKey: key,
        participants: [req.user._id, otherId],
      });
    }
    return res.json({ conversation: conv });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const listConversations = async (req, res) => {
  try {
    const list = await Conversation.find({
      participants: req.user._id,
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name username profilePicture")
      .lean();

    const shaped = list.map((c) => {
      const other = (c.participants || []).find(
        (p) => String(p._id) !== String(req.user._id),
      );
      return { ...c, otherUser: other || null };
    });

    return res.json({ conversations: shaped });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const listMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conv = await Conversation.findById(conversationId);
    if (!conv || !conv.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(404).json({ message: "Not found" });
    }
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 40)));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("senderId", "name username profilePicture")
        .lean(),
      Message.countDocuments({ conversationId }),
    ]);

    return res.json({
      messages: messages.reverse(),
      page,
      limit,
      total,
      hasMore: skip + messages.length < total,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { body } = req.body;
    const text = (body || "").trim();
    if (!text) return res.status(400).json({ message: "Message required" });

    const conv = await Conversation.findById(conversationId);
    if (!conv || !conv.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(404).json({ message: "Not found" });
    }

    const msg = await Message.create({
      conversationId,
      senderId: req.user._id,
      body: text,
    });
    conv.lastMessageAt = new Date();
    await conv.save();

    await msg.populate("senderId", "name username profilePicture");

    const recipient = conv.participants.find(
      (p) => String(p) !== String(req.user._id),
    );
    if (recipient) {
      await pushNotification({
        recipientId: recipient,
        actorId: req.user._id,
        type: "dm",
        title: "New message",
        message: text.slice(0, 120),
        meta: { conversationId: conv._id },
      });
    }

    return res.status(201).json({ chatMessage: msg });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
