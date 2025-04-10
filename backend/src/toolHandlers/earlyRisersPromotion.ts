import { ChatCompletionTool } from "openai/resources/chat";
import { DateTime } from "luxon";

export const earlyRisersPromotionTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "generateEarlyRisersPromo",
    description: "Generate a discount code for Early Risers",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

const generatePromoCode = (): string => {
  const code = `EARLY-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
  return code;
};

export const earlyRisersPromotionHandler = async (
  _args: Record<string, any>
): Promise<string> => {
  const pacificNow = DateTime.now().setZone("America/Los_Angeles");

  if (pacificNow.hour >= 8 && pacificNow.hour < 10) {
    return JSON.stringify({
      eligible: true,
      promoCode: generatePromoCode(),
    });
  }

  return JSON.stringify({
    eligible: false,
    currentTime: pacificNow.toFormat("hh:mm a ZZZZ"),
    reason:
      "The 10% discount of Early risers promotion is only available during the hours of 8:00 - 10:00 AM in Pacific Time.",
  });
};
