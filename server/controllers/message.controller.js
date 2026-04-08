import mongoose from "mongoose";
import Message from "../models/messages.model.js";
import User from "../models/users.model.js";
import Connection from "../models/connections.model.js";

function toId(v) {
  return new mongoose.Types.ObjectId(String(v));
}

async function areConnected(userA, userB) {
  const conn = await Connection.findOne({
    status: "accepted",
    $or: [
      { senderId: userA, receiverId: userB },
      { senderId: userB, receiverId: userA },
    ],
  })
    .select("_id")
    .lean();
  return !!conn;
}

export const getConversations = async (req, res) => {
  try {
    const myId = String(req.user._id);
    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name username profilePicture")
      .populate("receiverId", "name username profilePicture")
      .lean();

    const seen = new Set();
    const conversations = [];
    for (const m of messages) {
      const peer =
        String(m.senderId?._id) === myId ? m.receiverId : m.senderId;
      if (!peer?._id) continue;
      const peerId = String(peer._id);
      if (seen.has(peerId)) continue;
      seen.add(peerId);

      conversations.push({
        peer,
        lastMessage: {
          _id: m._id,
          body: m.body,
          createdAt: m.createdAt,
          senderId: m.senderId?._id,
          receiverId: m.receiverId?._id,
        },
      });
    }

    return res.status(200).json({ conversations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const myId = String(req.user._id);
    const peerId = String(req.params.peerId);
    if (!mongoose.Types.ObjectId.isValid(peerId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const [peerExists, connected] = await Promise.all([
      User.exists({ _id: peerId }),
      areConnected(myId, peerId),
    ]);
    if (!peerExists) return res.status(404).json({ message: "User not found" });
    if (!connected) {
      return res.status(403).json({ message: "You can only message your connections" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: peerId },
        { senderId: peerId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    await Message.updateMany(
      { senderId: peerId, receiverId: myId, readAt: null },
      { $set: { readAt: new Date() } },
    );

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const myId = String(req.user._id);
    const peerId = String(req.params.peerId);
    const body = String(req.body?.body || "").trim();

    if (!mongoose.Types.ObjectId.isValid(peerId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!body) return res.status(400).json({ message: "Message body is required" });
    if (myId === peerId) {
      return res.status(400).json({ message: "Cannot send message to self" });
    }

    const [peerExists, connected] = await Promise.all([
      User.exists({ _id: peerId }),
      areConnected(myId, peerId),
    ]);
    if (!peerExists) return res.status(404).json({ message: "User not found" });
    if (!connected) {
      return res.status(403).json({ message: "You can only message your connections" });
    }

    const message = await Message.create({
      senderId: toId(myId),
      receiverId: toId(peerId),
      body,
    });

    return res.status(201).json({ message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
