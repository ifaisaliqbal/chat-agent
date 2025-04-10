// toolHandlers/toolRegistry.ts
import {
  earlyRisersPromotionTool,
  earlyRisersPromotionHandler,
} from "./earlyRisersPromotion";
import {
  hikingRecommendationsTool,
  hikingRecommendationHandler,
} from "./hikingRecommendations";
import {
  lookupOrderStatusTool,
  lookupOrderStatusHandler,
} from "./lookupOrderStatus";
import { ChatCompletionTool } from "openai/resources/chat";

type ToolHandler = (args: Record<string, any>) => Promise<string>;

export interface ToolRegistration {
  tool: ChatCompletionTool;
  handler: ToolHandler;
}

export const toolRegistry: ToolRegistration[] = [
  { tool: lookupOrderStatusTool, handler: lookupOrderStatusHandler },
  { tool: earlyRisersPromotionTool, handler: earlyRisersPromotionHandler },
  { tool: hikingRecommendationsTool, handler: hikingRecommendationHandler },
];
