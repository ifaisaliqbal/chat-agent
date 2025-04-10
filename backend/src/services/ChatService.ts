// ChatService.ts
import { LlmChatClient } from "../clients/LlmChatClient";
import { RoleTypes } from "../types";
import { generalPrompt } from "../prompts/general";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat";
import { MAX_ATTEMPTS } from "../constants";
import logger from "../utils/logger";

import { toolRegistry } from "../toolHandlers/toolRegistry";

type ToolHandler = (args: Record<string, any>) => Promise<string>;

export class ChatService {
  private static instance: ChatService;
  private chatClient;
  private DEFAULT_RESPONSE = "Sorry, I wasn't able to help with that.";
  tools: ChatCompletionTool[];
  private toolHandlers: Record<string, ToolHandler>;

  constructor() {
    this.chatClient = LlmChatClient.getInstance();
    this.tools = toolRegistry.map((r) => r.tool);
    this.toolHandlers = Object.fromEntries(
      toolRegistry.map((r) => [r.tool.function.name, r.handler])
    );
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new ChatService();
    }
    return this.instance;
  };

  async handleMessage(
    message: string,
    history: ChatCompletionMessageParam[]
  ): Promise<string | null> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: RoleTypes.SYSTEM,
        content: generalPrompt,
      },
      ...history,
      {
        role: RoleTypes.USER,
        content: message,
      },
    ];

    let attempts = 0;
    let lastError: any = null;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      try {
        const chatCompletion = await this.chatClient.getLlmResponse(
          messages,
          this.tools
        );

        const responseMessage = chatCompletion.choices[0].message;
        logger.info("LLM response received", chatCompletion);

        if (!responseMessage.tool_calls) {
          return responseMessage.content ?? this.DEFAULT_RESPONSE;
        }

        messages.push(responseMessage);

        for (const toolCall of responseMessage.tool_calls) {
          const { name, arguments: argsJson } = toolCall.function;
          let args: Record<string, any> = {};
          try {
            args = JSON.parse(argsJson);
          } catch (e) {
            logger.error(`Invalid JSON for tool ${name}: ${argsJson}`, e);
            continue;
          }
          let result = "";
          const handler = this.toolHandlers[name];
          if (handler) {
            try {
              result = await handler(args);
            } catch (e) {
              logger.error(`Handler error for tool ${name}`, e);
              result = "Sorry, there was an error processing your request.";
            }
          } else {
            logger.error(`No handler found for tool: ${name}`);
            result = "Sorry, I couldn't process your request.";
          }
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: result,
          });
        }
      } catch (err) {
        lastError = err;
        logger.error("Error during response handling", err);
      }
    }
    logger.error("Max attempts reached,", lastError);
    return this.DEFAULT_RESPONSE;
  }
}
