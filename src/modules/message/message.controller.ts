import { Request, Response } from "express";
import { MessageServices } from "./message.service";

const getMessages = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.params;

    if (!participantId || typeof participantId !== "string") {
      throw new Error("Participant not found");
    }

    const userId = req.user?.id!;

    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await MessageServices.getMessages(
      userId,
      participantId,
      cursor,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve messages",
      data: null,
    });
  }
};

export const MessageControllers = {
  getMessages,
};
