import { Router } from 'express';
import { checkAuth } from '../middleware/checkAuth';
import { getChats, getChat } from '../controller/ChatController';
import uploadFile from '../middleware/upload/uploadFile';

const router = Router();

// router.route('/send/').post(checkAuth, uploadFile.single('file'), (req, res) => {
//     // Handle the chat message sending logic
//     console.log({ req })
//     sendMessage(req, res);
// });

router.route('/chats/').get(checkAuth, (req, res) => {
    // Handle retrieving the list of chats
    getChats(req, res);
});

router.route('/:id').get(checkAuth, (req, res) => {
    // Handle retrieving a specific chat
    getChat(req, res);
});

export { router as ChatAppRouter };