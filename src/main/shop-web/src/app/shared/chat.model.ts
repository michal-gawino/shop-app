import { User } from '../auth/user';

export interface ChatMessage {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  date: string;
  users: string[];
}

export interface UserChatHistory {
  chatId: string;
  user: User;
  messages: ChatMessage[];
}
