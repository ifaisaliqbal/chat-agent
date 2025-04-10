import axios from "./axios";
import { ChatRequest } from "../types";

const Endpoint = "/api/chat";

export const chatApi = {
  sendMessage: async (body: ChatRequest): Promise<string> => {
    const response = await axios.post(`${Endpoint}`, body);
    return response.data;
  },
};
