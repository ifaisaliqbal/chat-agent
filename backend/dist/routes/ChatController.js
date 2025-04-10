"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const express_1 = require("express");
const ChatService_1 = require("../services/ChatService");
class ChatController {
    constructor() {
        this.chatHandler = async (req, res) => {
            const { message } = req.body;
            try {
                const response = await this.chatService.handleMessage(message);
                res.status(200).send(response);
            }
            catch (err) {
                // Add error logging
                res.status(500).send("Something went wrong");
            }
        };
        this.router = (0, express_1.Router)();
        this.chatService = ChatService_1.ChatService.getInstance();
        this.router.post("/", this.chatHandler);
    }
}
exports.ChatController = ChatController;
