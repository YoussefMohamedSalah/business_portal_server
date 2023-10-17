import { Router } from 'express';
import { checkAuth } from '../middleware/checkAuth';
import { getDualChats, getChatMessages, getGroupChats } from '../controller/ChatController';
import uploadFile from '../middleware/upload/uploadFile';

const router = Router();


router.route('/dual/chats/').get(checkAuth, getDualChats);
router.route('/chat/:id').get(checkAuth, getChatMessages);

router.route('/group/chats/').get(checkAuth, getGroupChats);
router.route('/chat/:id').get(checkAuth, getChatMessages);


// router.route('/send/').post(checkAuth, uploadFile.single('file'), (req, res) => {
//     // Handle the chat message sending logic
//     console.log({ req })
//     sendMessage(req, res);
// });

// router.route('/:id').get(checkAuth, (req, res) => {
//     // Handle retrieving a specific chat
//     getChat(req, res);
// });

export { router as ChatAppRouter };