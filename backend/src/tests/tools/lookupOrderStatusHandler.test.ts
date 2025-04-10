import { lookupOrderStatusHandler } from "../../toolHandlers/lookupOrderStatus";

jest.mock("../../data/CustomerOrders.json", () => [
  {
    CustomerName: "John Doe",
    Email: "john.doe@example.com",
    OrderNumber: "#W001",
    ProductsOrdered: ["SKU001"],
    Status: "in-transit",
    TrackingNumber: "TRACK123456",
  },
  {
    CustomerName: "Jane Smith",
    Email: "jane.smith@example.com",
    OrderNumber: "#W002",
    ProductsOrdered: ["SKU002"],
    Status: "delivered",
    TrackingNumber: null,
  },
]);

describe("lookupOrderStatusHandler", () => {
  it("returns tracking info when tracking number is available", async () => {
    const result = JSON.parse(
      await lookupOrderStatusHandler({
        email: "john.doe@example.com",
        orderNumber: "#W001",
      })
    );

    expect(result.orderNumber).toBe("#W001");
    expect(result.orderStatus).toBe("in-transit");
    expect(result.tracking).toContain(
      "https://tools.usps.com/go/TrackConfirmAction"
    );
  });

  it("returns fallback tracking info when tracking number is null", async () => {
    const result = JSON.parse(
      await lookupOrderStatusHandler({
        email: "jane.smith@example.com",
        orderNumber: "#W002",
      })
    );

    expect(result.orderNumber).toBe("#W002");
    expect(result.orderStatus).toBe("delivered");
    expect(result.tracking).toBe("No tracking info");
  });

  it("is case-insensitive for email and order number", async () => {
    const result = JSON.parse(
      await lookupOrderStatusHandler({
        email: "JANE.SMITH@example.com",
        orderNumber: "#w002",
      })
    );

    expect(result.orderStatus).toBe("delivered");
  });

  it("returns an error object when order is not found", async () => {
    const result = JSON.parse(
      await lookupOrderStatusHandler({
        email: "not.found@example.com",
        orderNumber: "#W999",
      })
    );

    expect(result.error).toMatch(
      "Sorry, I couldn't find an order with number #W999 and email not.found@example.com."
    );
  });

  it("returns an error object when required params are missing", async () => {
    const result = JSON.parse(
      await lookupOrderStatusHandler({
        email: "john.doe@example.com",
        // orderNumber missing
      })
    );

    expect(result.error).toMatch(
      "Missing required parameters: email and orderNumber."
    );
  });
});
