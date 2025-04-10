import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat";

export class LlmChatClient {
  private static instance: LlmChatClient;
  private openAIClient: OpenAI;

  constructor() {
    const API_KEY = process.env.OPENAI_API_KEY;

    if (!API_KEY) {
      throw new Error("APIKEY not found");
    }

    this.openAIClient = new OpenAI({ apiKey: API_KEY });
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new LlmChatClient();
    }

    return this.instance;
  };

  getLlmResponse = async (
    messages: ChatCompletionMessageParam[],
    tools?: ChatCompletionTool[]
  ) => {
    const completion = await this.openAIClient.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      tools,
      tool_choice: "auto",
    });
    return completion;
  };
}
