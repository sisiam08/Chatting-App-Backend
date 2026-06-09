import { Request, Response } from "express";
import { ConversationServices } from "./conversation.service";

const createOrGetDirectConversation = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.body;

    const senderId = (req as any).user?.id;

    const conversation =
      await ConversationServices.createOrGetDirectConversation(
        senderId,
        receiverId,
      );

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ConversationControllers = {
  createOrGetDirectConversation,
};
