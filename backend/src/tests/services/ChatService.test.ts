import { LlmChatClient } from "../../clients/LlmChatClient";
import { MAX_ATTEMPTS } from "../../constants";
import { ChatService } from "../../services/ChatService";

jest.mock("../../clients/LlmChatClient");

jest.mock("../../toolHandlers/earlyRisersPromotion", () => ({
  earlyRisersPromotionHandler: jest
    .fn()
    .mockResolvedValue(
      JSON.stringify({ eligible: true, promoCode: "EARLY-TEST" })
    ),
  earlyRisersPromotionTool: { function: { name: "generateEarlyRisersPromo" } },
}));
jest.mock("../../toolHandlers/hikingRecommendations", () => ({
  hikingRecommendationHandler: jest
    .fn()
    .mockResolvedValue(
      JSON.stringify({ difficulty: "Moderate", data: "Trail 1" })
    ),
  hikingRecommendationsTool: { function: { name: "getHikingRecommendation" } },
}));
jest.mock("../../toolHandlers/lookupOrderStatus", () => ({
  lookupOrderStatusHandler: jest.fn().mockResolvedValue(
    JSON.stringify({
      orderNumber: "#W001",
      orderStatus: "Shipped",
      tracking: "url",
    })
  ),
  lookupOrderStatusTool: { function: { name: "lookupOrderStatus" } },
}));

describe("ChatService", () => {
  let chatService: ChatService;
  const mockGetLlmResponse = jest.fn();

  beforeEach(() => {
    jest.spyOn(LlmChatClient, "getInstance").mockReturnValue({
      getLlmResponse: mockGetLlmResponse,
    } as unknown as LlmChatClient);
    chatService = ChatService.getInstance();
    mockGetLlmResponse.mockReset();
  });

  it("returns assistant response directly when no tool call is needed", async () => {
    mockGetLlmResponse.mockResolvedValueOnce({
      choices: [
        {
          message: {
            role: "assistant",
            content: "Sure! Our backpacks are great for hikes.",
          },
        },
      ],
    });

    const result = await chatService.handleMessage("Tell me about gear", []);
    expect(result).toBe("Sure! Our backpacks are great for hikes.");
  });

  it("handles tool call and returns final GPT response after tool result", async () => {
    mockGetLlmResponse
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              role: "assistant",
              tool_calls: [
                {
                  id: "call_1",
                  function: {
                    name: "getHikingRecommendation",
                    arguments: JSON.stringify({ difficulty: "Moderate" }),
                  },
                },
              ],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              role: "assistant",
              content: "Here are some moderate hikes for you...",
            },
          },
        ],
      });

    const result = await chatService.handleMessage(
      "What hikes do you recommend?",
      []
    );

    expect(mockGetLlmResponse).toHaveBeenCalledTimes(2);
    expect(result).toContain("Here are some moderate hikes");
  });

  it("returns fallback response after max attempts", async () => {
    mockGetLlmResponse.mockResolvedValue({
      choices: [
        {
          message: {
            role: "assistant",
            tool_calls: [
              {
                id: "call_repeat",
                function: {
                  name: "getHikingRecommendation",
                  arguments: JSON.stringify({ difficulty: "Moderate" }),
                },
              },
            ],
          },
        },
      ],
    });

    const result = await chatService.handleMessage("Loop me forever", []);
    expect(mockGetLlmResponse).toHaveBeenCalledTimes(MAX_ATTEMPTS);
    expect(result).toBe("Sorry, I wasn't able to help with that.");
  });
});
