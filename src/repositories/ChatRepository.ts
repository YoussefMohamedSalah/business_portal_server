import { getRepository } from "typeorm";
import { Chat } from "../entities/Chat";
import { ChatMessage } from "../entities/ChatMessage";
import { User } from "../entities/User";


export const getChatById = async (id: string) => {
    try {
        const chatRepository = getRepository(Chat);
        const chat = await chatRepository
            .createQueryBuilder("chat")
            .where("chat.id = :id", { id: id })
            .getOne();
        return chat;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};

export const createMessage = async (createMessageInput: any) => {
    const { content, chat, senderId, recipientId } = createMessageInput;
    try {
        const chatMessageRepository = getRepository(ChatMessage);
        const chatMessage = new ChatMessage();
        chatMessage.message = content ? content : '';
        chatMessage.chat = chat;
        chatMessage.senderId = senderId;
        chatMessage.recipientId = recipientId;
        await chatMessageRepository.save(chatMessage);
        return chatMessage;
    } catch (error) {
        // Handle the error
        console.error("Error adding message:", error);
        return;
    }
};

export const getChatMessagesById = async (id: string) => {
    try {
        const chatRepository = getRepository(Chat);
        const chat = await chatRepository
            .createQueryBuilder("chat")
            .where("chat.id = :id", { id: id })
            // .leftJoinAndSelect('chat.users', 'user')
            .leftJoinAndSelect('chat.messages', 'chat_message')
            .getOne();
        return chat;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};

export const getUserChats = async (userId: string) => {
    try {
        const usersRepository = getRepository(User);
        const user = await usersRepository
            .createQueryBuilder("user")
            .where("user.id = :userId", { userId })
            .leftJoinAndSelect("user.chats", "chat")
            .orderBy("chat.updatedAt", "DESC")
            .getOne();
        return user?.chats || [];
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};