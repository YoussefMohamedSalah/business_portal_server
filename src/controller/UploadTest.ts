import { Request, Response } from 'express';
import multer from 'multer';
import fileUpload from 'express-fileupload';
















// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Specify the destination directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
//     }
// });

// const upload = multer({ storage: storage });



// export const uploadTest = (upload.single('file'), (req: Request, res: Response) => {
//     // The uploaded file can be accessed via req.file
//     console.log(req.file)
//     // You can process the file, save it to the database, etc.
//     res.send('File uploaded successfully');
// });









// // DONE
// export const uploadTest = async (req: Request, res: Response) => {
//     // const { companyId } = req.userData!;
//     // const createData: CreateInventoryInfo = req.body;
//     // // first get company by id
//     // if (companyId) return res.status(400).json({ msg: "Company id is required" });
//     // const company = await getCompanyById(companyId);
//     // if (!company) return res.status(404).json({ msg: "Company not found" });
//     // // then create Inventory
//     // const inventory = await createInventory(createData, company);
//     // if (!inventory) return res.status(409).json({ msg: "Field To Create Inventory" });
//     // else return res.json(inventory);
// };

