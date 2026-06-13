import { MessageType } from "../generated/prisma/enums";

export interface ICreateMessagePayload {
  conversationId: string;
  userId: string;
  content: string;
  type: MessageType;
  fileName?: string;
  fileSize?: number;
}

export interface ISocketMessagePayload {
  conversationId: string;
  content: string;
}
