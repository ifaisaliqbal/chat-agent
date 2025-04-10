import { ChatCompletionTool } from "openai/resources/chat";
import trailsData from "../data/TrailsData.json";

export const hikingRecommendationsTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getHikingRecommendation",
    description:
      "Give enthusiastic hiking trail recommendations based on difficulty.",
    parameters: {
      type: "object",
      properties: {
        difficulty: {
          type: "string",
          description: "Preferred hiking difficulty: Easy, Moderate, or Hard",
        },
      },
      required: ["difficulty"],
    },
  },
};

export const hikingRecommendationHandler = async (
  args: Record<string, any>
): Promise<string> => {
  const { difficulty } = args;
  if (!difficulty) {
    return JSON.stringify({
      error:
        "Missing required parameter: difficulty. Please specify Easy, Moderate, or Hard.",
    });
  }

  const filtered = trailsData.filter(
    (trail) => trail.difficulty.toLowerCase() === difficulty.toLowerCase()
  );

  if (filtered.length === 0) {
    return JSON.stringify({
      error: `Sorry, I couldn't find any trails matching the difficulty '${difficulty}'. Try Easy, Moderate, or Hard.`,
    });
  }

  const lines = filtered.map(
    (trail, i) =>
      `${i + 1}. **${trail.name}** - ${trail.location}\n   - Gear: ${
        trail.gear
      }`
  );

  return JSON.stringify({
    difficulty,
    data: lines.join("\n\n"),
  });
};
