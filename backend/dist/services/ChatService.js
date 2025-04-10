"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const LlmChatClient_1 = require("../clients/LlmChatClient");
class ChatService {
    constructor() {
        this.handleMessage = (message) => {
            const messages = [
                {
                    role: "system",
                    content: "You are a helpful outdoor enthusiast assistant for Sierra Outfitters. Use outdoorsy tone with mountain emojis, trail tips, and gear suggestions.",
                },
                {
                    role: "user",
                    content: message,
                },
            ];
        };
        this.chatClient = LlmChatClient_1.LlmChatClient.getInstance();
    }
}
exports.ChatService = ChatService;
_a = ChatService;
ChatService.getInstance = () => {
    if (!_a.instance) {
        _a.instance = new _a();
    }
    return _a.instance;
};
