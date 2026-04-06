import Notification from "../models/notification.model.js";

export const listNotifications = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Notification.find({ recipientId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("actorId", "name username profilePicture")
        .lean(),
      Notification.countDocuments({ recipientId: req.user._id }),
    ]);

    return res.json({ notifications: items, page, limit, total, hasMore: skip + items.length < total });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const unreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user._id,
      read: false,
    });
    return res.json({ count });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { read: true },
      { new: true },
    );
    if (!n) return res.status(404).json({ message: "Not found" });
    return res.json({ notification: n });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id, read: false },
      { read: true },
    );
    return res.json({ message: "OK" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
