import { hikingRecommendationHandler } from "../../toolHandlers/hikingRecommendations";

jest.mock("../../data/TrailsData.json", () => [
  {
    name: "Whispering Pines Trail",
    difficulty: "Moderate",
    location: "Pacific Northwest",
    gear: "Backcountry Blaze Backpack & Jetpack",
  },
  {
    name: "Sunset Ridge Loop",
    difficulty: "Easy",
    location: "California Foothills",
    gear: "Invisibility Cloak",
  },
]);

describe("hikingRecommendationHandler", () => {
  it("returns Moderate difficulty trails in structured JSON", async () => {
    const result = JSON.parse(
      await hikingRecommendationHandler({ difficulty: "Moderate" })
    );

    expect(result.difficulty).toBe("Moderate");
    expect(result.data).toContain("1. **Whispering Pines Trail**");
    expect(result.data).toContain("Gear: Backcountry Blaze Backpack & Jetpack");
  });

  it("is case-insensitive when matching difficulty", async () => {
    const result = JSON.parse(
      await hikingRecommendationHandler({ difficulty: "easy" })
    );

    expect(result.difficulty).toBe("easy");
    expect(result.data).toContain("Sunset Ridge Loop");
  });

  it("returns error message object when no match found", async () => {
    const result = JSON.parse(
      await hikingRecommendationHandler({ difficulty: "Extreme" })
    );

    expect(typeof result).toBe("object");
    expect(result.error).toContain(
      "couldn't find any trails matching the difficulty 'Extreme'"
    );
  });

  it("returns error message object when difficulty is missing", async () => {
    const result = JSON.parse(await hikingRecommendationHandler({}));

    expect(typeof result).toBe("object");
    expect(result.error).toContain("Missing required parameter: difficulty");
  });
});
