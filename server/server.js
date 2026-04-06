// Essential Packages
import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { apiLimiter } from "./middlewares/rateLimits.js";
import { attachIO } from "./realtime/io.js";

// Routes
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import messageRoutes from "./routes/messages.routes.js";

dotenv.config();

const app = express();

const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(
  cors({
    origin: clientOrigins.length === 1 ? clientOrigins[0] : clientOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", apiLimiter);
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Server is live" });
});
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: clientOrigins.length === 1 ? clientOrigins[0] : clientOrigins,
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const raw = socket.handshake.headers.cookie || "";
    const cookies = cookie.parse(raw);
    const token = cookies.accessToken;
    if (!token) return next(new Error("Unauthorized"));
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    socket.userId = String(decoded.userId);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.userId}`);
});

attachIO(io);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} (HTTP + Socket.IO)`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

start();
