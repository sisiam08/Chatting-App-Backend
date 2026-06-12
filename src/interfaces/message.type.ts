export interface ICreateMessagePayload {
  conversationId: string;
  userId: string;
  content: string;
}

export interface ISocketMessagePayload {
  conversationId: string;
  content: string;
}
