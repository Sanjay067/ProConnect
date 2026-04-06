let ioRef = null;

export function attachIO(io) {
  ioRef = io;
}

export function getIO() {
  return ioRef;
}

export function notifyUser(userId, event, payload) {
  if (!ioRef || !userId) return;
  ioRef.to(`user:${userId}`).emit(event, payload);
}
