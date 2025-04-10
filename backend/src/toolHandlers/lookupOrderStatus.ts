import { ChatCompletionTool } from "openai/resources/chat";
import orders from "../data/CustomerOrders.json";

export const lookupOrderStatusTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "lookupOrderStatus",
    description: "Look up a customer order by email and order number",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "The customer email address",
        },
        orderNumber: {
          type: "string",
          description: "The customer order number (e.g. #W001)",
        },
      },
      required: ["email", "orderNumber"],
    },
  },
};

export const lookupOrderStatusHandler = async (
  args: Record<string, any>
): Promise<string> => {
  const { email, orderNumber } = args;
  if (!email || !orderNumber) {
    return JSON.stringify({
      error: "Missing required parameters: email and orderNumber.",
    });
  }

  const order = orders.find(
    (o) =>
      o.Email.toLowerCase() === email.toLowerCase() &&
      o.OrderNumber.toLowerCase() === orderNumber.toLowerCase()
  );

  if (!order) {
    return JSON.stringify({
      error: `Sorry, I couldn't find an order with number ${orderNumber} and email ${email}.`,
    });
  }

  const trackingInfo =
    order.TrackingNumber !== null
      ? {
          orderNumber,
          orderStatus: order.Status,
          tracking: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.TrackingNumber}`,
        }
      : {
          orderNumber,
          orderStatus: order.Status,
          tracking: "No tracking info",
        };

  return JSON.stringify(trackingInfo);
};
