import { Router, Request, Response } from "express";
import { ChatService } from "../services/ChatService";
import logger from "../utils/logger";

export class ChatController {
  public router: Router;
  private chatService: ChatService;

  constructor() {
    this.router = Router();
    this.chatService = ChatService.getInstance();
    this.router.post("/", this.chatHandler);
  }

  chatHandler = async (req: Request, res: Response) => {
    const { message, history } = req.body;
    try {
      const response = await this.chatService.handleMessage(message, history);
      res.status(200).send(response);
    } catch (err) {
      logger.error(err);
      res.status(500).send("Something went wrong");
    }
  };
}
