import Connection from "../models/connections.model.js";
import User from "../models/users.model.js";

export const sendConnection = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;
    console.log(senderId, receiverId);

    if (senderId.toString() === receiverId)
      return res
        .status(400)
        .json({ message: "You can't send connection request to yourself" });

    const receiver = await User.findById(receiverId);
    if (!receiver)
      return res.status(400).json({ message: "Receiver doesn't exist" });

    const existingConnection = await Connection.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existingConnection)
      return res.status(400).json({ message: "Request already exists" });
    const connection = await Connection.create({
      senderId,
      receiverId,
    });

    return res.status(200).json({
      message: "Connection request sent",
      connectionReqSentTo: receiverId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const findConnection = await Connection.findOneAndUpdate(
      {
        _id: connectionId,
        receiverId: req.user._id,
        status: "pending",
      },
      {
        status: "accepted",
      },
      { new: true },
    );

    if (!findConnection)
      return res
        .status(400)
        .json({ message: "Connection not found or already processed" });

    return res.status(200).json({
      message: "Connection request accepted",
      connection: findConnection,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const findConnection = await Connection.findOneAndUpdate(
      {
        _id: connectionId,
        receiverId: req.user._id,
        status: "pending",
      },
      {
        status: "rejected",
      },
      { new: true },
    );

    if (!findConnection)
      return res
        .status(400)
        .json({ message: "Connection not found or already processed" });

    return res.status(200).json({
      message: "Connection request rejected",
      connection: findConnection,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const findConnection = await Connection.findOneAndDelete({
      _id: connectionId,
      senderId: req.user._id,
      status: "pending",
    });

    if (!findConnection)
      return res.status(400).json({ message: "Connection not found" });

    return res.status(200).json({
      message: "Connection request cancelled",
      connection: findConnection,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const findConnection = await Connection.findOneAndDelete({
      _id: connectionId,
      status: "accepted",
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    });

    if (!findConnection)
      return res.status(400).json({ message: "Connection not found" });

    return res.status(200).json({
      message: "Connection request cancelled",
      connection: findConnection,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
      status: "accepted",
    });

    return res.status(200).json({
      message: "Connections fetched successfully",
      connections,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
