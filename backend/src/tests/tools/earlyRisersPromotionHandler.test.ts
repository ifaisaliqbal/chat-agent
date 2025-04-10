import { DateTime } from "luxon";
import { earlyRisersPromotionHandler } from "../../toolHandlers/earlyRisersPromotion";

describe("earlyRisersPromotionHandler", () => {
  let nowSpy: jest.SpyInstance;

  afterEach(() => {
    if (nowSpy) nowSpy.mockRestore();
  });

  it("returns a promo code when within 8-10 AM PT", async () => {
    nowSpy = jest
      .spyOn(DateTime, "now")
      .mockReturnValue(
        DateTime.fromObject(
          { hour: 8, minute: 30 },
          { zone: "America/Los_Angeles" }
        ) as DateTime<true>
      );

    const result = JSON.parse(await earlyRisersPromotionHandler({}));

    expect(result.eligible).toBe(true);
    expect(result.promoCode).toMatch(/^EARLY-[A-Z0-9]{6}$/);
  });

  it("returns ineligible before 8 AM PT", async () => {
    nowSpy = jest
      .spyOn(DateTime, "now")
      .mockReturnValue(
        DateTime.fromObject(
          { hour: 7, minute: 0 },
          { zone: "America/Los_Angeles" }
        ) as DateTime<true>
      );

    const result = JSON.parse(await earlyRisersPromotionHandler({}));

    expect(result.eligible).toBe(false);
    expect(result.currentTime).toMatch(/07:00 AM/);
    expect(result.reason).toContain(
      "only available during the hours of 8:00 - 10:00 AM"
    );
  });

  it("returns ineligible after 10 AM PT", async () => {
    nowSpy = jest
      .spyOn(DateTime, "now")
      .mockReturnValue(
        DateTime.fromObject(
          { hour: 10, minute: 1 },
          { zone: "America/Los_Angeles" }
        ) as DateTime<true>
      );

    const result = JSON.parse(await earlyRisersPromotionHandler({}));

    expect(result.eligible).toBe(false);
  });
});
