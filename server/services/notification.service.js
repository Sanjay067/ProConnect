import Notification from "../models/notification.model.js";
import { notifyUser } from "../realtime/io.js";

export async function pushNotification(doc) {
  const n = await Notification.create(doc);
  const lean = n.toObject();
  notifyUser(String(doc.recipientId), "notification", { notification: lean });
  return n;
}
