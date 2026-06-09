import { Request, Response } from "express";
import { MessageServices } from "./message.service";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, content } = req.body;

    const senderId = (req as any).user?.id;

    const message = await MessageServices.sendMessage({
      conversationId,
      senderId,
      content,
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId || typeof conversationId !== "string") {
      throw new Error("Conversation not found");
    }

    const messages = await MessageServices.getMessages(conversationId);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const MessageControllers = {
  sendMessage,
  getMessages,
};
