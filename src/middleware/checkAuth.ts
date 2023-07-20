import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// constants
dotenv.config();
const secretHash = process.env.SECRET_HASH;

const checkAuth = async (req: any, res: any, next: any) => {
	// const header = req.header("Authorization");
	const { Authorization } = req.headers;
	if (!Authorization) {
		return res.status(400).json({
			errors: [
				{
					msg: "No Authorization Header Found",
				},
			],
		});
	}
	const token = Authorization.split(" ")[1];

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
		const user: any = await jwt.verify(token, `${secretHash}`);
		req.userData = { userId: user.userId };
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
};

export { checkAuth };
