import multer from 'multer';
import dotenv from 'dotenv';
import { UploadPath } from '../../enums/uploadPath';

dotenv.config();

// Multer configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, UploadPath.REQUEST); // Set the destination folder where files will be saved
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
	},
});

const uploadRequest = multer({ storage });

export default uploadRequest;