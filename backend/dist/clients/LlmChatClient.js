"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmChatClient = void 0;
const openai_1 = __importDefault(require("openai"));
class LlmChatClient {
    constructor() {
        this.getLlmResponse = async (messages) => {
            const completion = await this.openAIClient.chat.completions.create({
                model: "gpt-4o",
                messages,
                temperature: 0.7,
            });
            return completion.choices[0].message.content;
        };
        const API_KEY = process.env.OPENAI_API_KEY;
        if (!API_KEY) {
            throw new Error("APIKEY not found");
        }
        this.openAIClient = new openai_1.default({ apiKey: API_KEY });
    }
}
exports.LlmChatClient = LlmChatClient;
_a = LlmChatClient;
LlmChatClient.getInstance = () => {
    if (!_a.instance) {
        _a.instance = new _a();
    }
    return _a.instance;
};
