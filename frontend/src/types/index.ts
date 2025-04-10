export interface ChatRequest {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  response: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
