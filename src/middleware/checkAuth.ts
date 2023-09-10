import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// constants
dotenv.config();
const secretHash = process.env.SECRET_HASH;


// Extend the Request interface to include the `userData` property
declare global {
	namespace Express {
		interface Request {
			userData?: {
				userId: string;
				companyId: string;
				userName: string;
			};
		}
	}
}
const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(400).json({
			errors: [
				{
					msg: "No Authorization Header Found",
				},
			],
		});
	}
	const token = authorization.split(" ")[1];

	if (!token) {
		return res.status(400).json({
			errors: [
				{
					msg: "Missing Authorization token",
				},
			],
		});
	}

	try {
		const user: any = jwt.verify(token, `${secretHash}`);
		const { userId, companyId, userName } = user;
		req.userData = { userId, companyId, userName };
		next();
	} catch (error) {
		return res.status(400).json({
			errors: [
				{
					msg: "Token Invalid",
				},
			],
		});
	}
	return;
};

export { checkAuth };
