import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatController } from "./routes/ChatController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const chatController = new ChatController();
app.use("/api/chat", chatController.router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
