import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./configs/connect.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5020;

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/replies", replyRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
