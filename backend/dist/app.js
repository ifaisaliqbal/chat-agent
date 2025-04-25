"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ChatController_1 = require("./routes/ChatController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const chatController = new ChatController_1.ChatController();
app.use("/api/chat", chatController.router);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});
// export default app;
