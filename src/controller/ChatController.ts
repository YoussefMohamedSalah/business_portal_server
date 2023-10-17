import { Request, Response } from 'express';
import { Chat } from '../entities/Chat';
import { getUserChats, getChatById, getChatMessagesById, createMessage } from '../repositories/ChatRepository';
import { getForChatById } from "../repositories/UserRepository";
import { validateUUID } from '../utils/validateUUID';

export const sendMessage = async (sendMessageInput: { content: string, chatId: string, senderId: string, recipientId: string }) => {
	const { content, chatId, senderId, recipientId } = sendMessageInput;

	try {
		// If chatId is provided, it means there is already a chat between the users
		if (chatId) {
			let isValidUUID = validateUUID(chatId);
			if (!isValidUUID) return ({ msg: "Chat Id is not valid" });

			const chat = await getChatById(chatId);
			if (!chat) return ({ msg: 'Chat Is Not Found' })

			const createMessageInput = { content, chat, senderId, recipientId };
			const message = await createMessage(createMessageInput);

			chat.last_message = { content, status: false };
			await chat.save();
			return message;
		};

		const sender = await getForChatById(senderId);
		if (!sender) return ({ msg: "Sender not found" });

		const recipient = await getForChatById(recipientId);
		if (!recipient) return ({ msg: "Receiver not found" });

		const chat = new Chat();
		chat.users = [recipient, sender]; // Assuming userId represents the sender's ID
		chat.between = [{
			id: senderId,
			name: sender.first_name + sender.last_name,
			avatar: sender.avatar || ''
		},
		{
			id: recipient.id,
			name: recipient.first_name + ' ' + recipient.last_name,
			avatar: recipient.avatar || ''
		}];
		chat.last_message = { content, status: false };
		await chat.save();

		const createMessageInput = {
			content,
			chat,
			senderId: sender.id,
			recipientId: recipient.id
		};

		const message = await createMessage(createMessageInput);

		return message;
	} catch (error) {
		console.error('Error creating chat:', error);
		return { msg: 'Internal server error' };
	}
};

export const getChats = async (req: Request, res: Response) => {
	const { userId } = req.userData!;

	try {
		const chats = await getUserChats(userId);
		let dataToReturn = {
			userId,
			chats
		}
		return res.json(dataToReturn);
	} catch (error) {
		console.error('Error retrieving chat Messages:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const getChatMessages = async (req: Request, res: Response) => {
	const { id } = req.params!;
	console.log(id)
	try {
		const messages = await getChatMessagesById(id);
		console.log(messages)
		return res.json(messages);
	} catch (error) {
		console.error('Error retrieving chat Messages:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};