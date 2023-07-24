import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const secretHash = process.env.SECRET_HASH;

export const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	// Check if the owner exists
	const userRepository = getRepository(User);
	const user = await userRepository
		.createQueryBuilder("user")
		.addSelect("user.password")
		// .leftJoinAndSelect("user.permissionsCategories", "permissionsCategories")
		.where({ email })
		.getOne();
	if (!user) {
		return res.status(401).json({ message: "Invalid email or password" });
	}
	// Check if the password is correct
	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if (!isPasswordCorrect) {
		return res.status(401).json({ message: "Invalid email or password" });
	}
	// Generate an access token with user data
	const accessToken = jwt.sign(
		{
			userId: user.id,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "30d" }
	);
	// Return the access token and user data in the response
	return res.json({ accessToken, userInfo: user });
};

export const signUp = async (req: Request, res: Response) => {
	try {
		const {
			email,
			password,
			first_name,
			last_name,
			phone_number
		} = req.body;
		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create a new user
		const newUser = await User.create({
			first_name,
			last_name,
			password: await bcrypt.hash(password, 10),
			email,
			phone_number
		}).save();
		// Generate an access token with user data
		const accessToken = jwt.sign(
			{
				userId: newUser.id,
				email: newUser.email
			},
			secretHash as string,
			{ expiresIn: "30d" }
		);

		// Return the access token and user data in the response
		return res.json({
			accessToken,
			userInfo: {
				id: newUser.id,
				first_name: newUser.first_name,
				last_name: newUser.last_name,
				email: newUser.email,
				phone_number: newUser.phone_number,
				avatar: ""
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
	}
};

router.route("/auth/login").post(signIn);
router.route("/auth/signup").post(signUp);

export { router as AuthRouter };
