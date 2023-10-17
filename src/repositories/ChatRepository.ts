import { getRepository } from "typeorm";
import { Chat } from "../entities/Chat";
import { ChatMessage } from "../entities/ChatMessage";
import { User } from "../entities/User";
import { Group } from "../entities/Group";




export const createChat = async (group: Group) => {
    try {
        const chatRepository = getRepository(Chat);
        const chat = new Chat();
        chat.between = [];
        chat.group = group;
        await chatRepository.save(chat);
        return chat;
    } catch (error) {
        console.error("Error creating chat:", error);
        return;
    }
}

export const getChatById = async (id: string) => {
    try {
        const chatRepository = getRepository(Chat);
        const chat = await chatRepository
            .createQueryBuilder("chat")
            .where("chat.id = :id", { id: id })
            .leftJoinAndSelect('chat.users', 'user')
            .getOne();
        return chat;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};

export const createMessage = async (createMessageInput: { content: string, chat: Chat, senderId: string, recipientId: string }) => {
    const { content, chat, senderId, recipientId } = createMessageInput;
    try {
        const chatMessageRepository = getRepository(ChatMessage);
        const chatMessage = new ChatMessage();
        chatMessage.content = content ? content : '';
        chatMessage.chat = chat;
        chatMessage.senderId = senderId;
        if (recipientId && recipientId !== '') chatMessage.recipientId = recipientId;
        await chatMessageRepository.save(chatMessage);
        return chatMessage;
    } catch (error) {
        // Handle the error
        console.error("Error adding message:", error);
        return;
    }
};

// Dual Chats

export const getDualUserChats = async (userId: string) => {
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

// Groups Chat
export const getGroupUserChats = async (userId: string) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .where("user.id = :userId", { userId })
            .leftJoinAndSelect('user.groups', 'group')
            .getOne();
        return user?.groups! || [];
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};

export const getChatMessagesById = async (id: string) => {
    try {
        const chatRepository = getRepository(Chat);
        const chat = await chatRepository
            .createQueryBuilder("chat")
            .where("chat.id = :id", { id: id })
            .leftJoinAndSelect('chat.messages', 'chat_message')
            .getOne();
        return chat;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};

export const getChatByGroupId = async (id: string) => {
    try {
        const groupRepository = getRepository(Group);
        const group = await groupRepository
            .createQueryBuilder("group")
            .where("group.id = :id", { id: id })
            .leftJoinAndSelect('group.chat', 'chat')
            .getOne();
        return group?.chat!;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Chats:", error);
        return;
    }
};



