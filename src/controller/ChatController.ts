import { Request, Response } from 'express';
import WebSocket from 'ws';
import { Server } from 'http';
// ********************************************
import { Chat } from '../entities/Chat';
import { getUserChats, getChatById, getChatMessagesById, createMessage } from '../repositories/ChatRepository';
import { getForChatById } from "../repositories/UserRepository";
import { validateUUID } from '../utils/validateUUID';
import { getRepository } from 'typeorm';
import { ChatMessage } from '../entities/ChatMessage';



let wss: WebSocket.Server;


export function broadcastMessage(message: string) {
	// Broadcast the message to all connected WebSocket clients
	wss.clients.forEach((client) => {
		client.send(message);
	});
};

export const getChat = async (req: Request, res: Response) => {
	const { userId } = req.userData!;
	const { id } = req.params!;
	try {
		const messages = await getChatMessagesById(id);
		let dataToReturn = {
			userId,
			messages
		}
		return res.json(dataToReturn);
	} catch (error) {
		console.error('Error retrieving chat Messages:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// export const sendMessage = async (req: Request, res: Response) => {
// 	const { userId, userName } = req.userData!;
// 	const { message, chatId, receiverId } = req.body;
// 	console.log(req.body)

// 	try {
// 		// If chatId is provided, it means there is already a chat between the users
// 		if (chatId) {
// 			let isValidUUID = validateUUID(chatId);
// 			if (!isValidUUID) return res.status(400).json({ msg: "Chat Id is not valid" });
// 			const chat = await getChatById(chatId);
// 			if (!chat) return res.status(404).json({ msg: 'Chat Is Not Found' })
// 			const createMessageInput = {
// 				message,
// 				chat,
// 				userId,
// 				userName
// 			};
// 			const messageRes = await createMessage(createMessageInput);

// 			// Broadcast the message to all connected WebSocket clients
// 			broadcastMessage(JSON.stringify(messageRes))

// 			chat.last_message = { content: message, status: false };
// 			await chat.save();
// 			return res.status(201).json(messageRes);
// 		};

// 		const sender = await getForChatById(userId);
// 		if (!sender) return res.status(404).json({ msg: "Sender not found" });

// 		const receiver = await getForChatById(receiverId);
// 		if (!receiver) return res.status(404).json({ msg: "Receiver not found" });

// 		const chat = new Chat();
// 		chat.users = [receiver, sender]; // Assuming userId represents the sender's ID
// 		chat.between = [{
// 			id: userId,
// 			name: userName,
// 			avatar: sender.avatar || ''
// 		},
// 		{
// 			id: receiver.id,
// 			name: receiver.first_name + ' ' + receiver.last_name,
// 			avatar: receiver.avatar || ''
// 		}];
// 		chat.last_message = { content: message, status: false };
// 		await chat.save();

// 		const createMessageInput = {
// 			message,
// 			chat,
// 		};

// 		await createMessage(createMessageInput);
// 		const messageRes = await createMessage(createMessageInput);

// 		return res.status(201).json(messageRes);
// 	} catch (error) {
// 		console.error('Error creating chat:', error);
// 		return res.status(500).json({ message: 'Internal server error' });
// 	}
// };

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


export const sendChatMessage = async (createInput: any) => {
	const { content, chatId, recipientId, senderId } = createInput;

	if(!senderId) throw new Error('Sender Id Is Not Exists');
	try {
		// If chatId is provided, it means there is already a chat between the users
		if (chatId) {
			let isValidUUID = validateUUID(chatId);
			if (!isValidUUID) return ({ msg: "Chat Id is not valid" });
			const chat = await getChatById(chatId);
			if (!chat) return ({ msg: 'Chat Is Not Found' });

			const chatMessageRepository = getRepository(ChatMessage);
			const chatMessage = new ChatMessage();
			chatMessage.message = content ? content : '';
			chatMessage.chat = chat;
			chatMessage.senderId = senderId;
			chatMessage.recipientId = recipientId;
			await chatMessageRepository.save(chatMessage);

			chat.last_message = { content: content, status: false };
			await chat.save();
			return chatMessage ? chatMessage : {};
		}

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
		chat.last_message = { content: content, status: false };
		await chat.save();

		const createMessageInput = {
			content,
			chat,
		};

		const messageRes = await createMessage(createMessageInput);
		return messageRes;

	} catch (error) {
		console.error('Error creating chat:', error);
		return ({ message: 'Internal server error' });
	}
};