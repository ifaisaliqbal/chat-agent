export interface ChatClientAIMessage {
  role: "user" | "system" | "assistant" | "tool";
  content: string | null;
  tool_call_id?: string;
}

export interface Order {
  CustomerName: string;
  Email: string;
  OrderNumber: string;
  ProductsOrdered: string[];
  Status: "delivered" | "in-transit" | "fulfilled" | "error";
  TrackingNumber: string | null;
}

export enum RoleTypes {
  SYSTEM = "system",
  ASSISTANT = "assistant",
  USER = "user",
  TOOL = "tool",
}
