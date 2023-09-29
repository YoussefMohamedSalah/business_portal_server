import multer from 'multer';
import dotenv from 'dotenv';
import { UploadPath } from '../../enums/uploadPath';

dotenv.config();
let baseUrl: string | undefined = process.env.BASE_URL

// Multer configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, UploadPath.LOGO); // Set the destination folder where files will be saved
	},
	filename: (req, file, cb) => {
		cb(null, baseUrl ? baseUrl : '' + Date.now() + '-' + file.originalname); // Set the filename to be unique
	},
});

const uploadLogo = multer({ storage });

export default uploadLogo;