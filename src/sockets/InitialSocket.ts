import { Server } from 'socket.io';
import { sendMessage } from '../controller/ChatController';

export const initSocketServer = async (io: Server) => {
    console.log('io server is Now Running on port 8081');

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('join_notification_center', (companyId) => {
            console.log(`User Joined Notification Center: ${companyId}`);
            socket.join(companyId);
        });

        socket.on("join_chat", (chatId) => {
            console.log(`chatId: ${chatId}`);
            socket.join(chatId);
        });

        socket.on("send_message", async (data) => {
            console.log(data)
            const { content, chatId, senderId, recipientId } = JSON.parse(data);
            console.log(`send_message: ${content}`);

            try {
                const createMessageInput = { content, chatId, senderId, recipientId };
                const message = await sendMessage(createMessageInput);

                if (message) {
                    socket.to(data.chatId).emit("received_message", message); // Emit to all sockets in the chat room except the sender
                    socket.broadcast.emit("received_message", message); // Emit the message to the sender
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });
    });
};