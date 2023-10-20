import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { verify, JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createCompany } from "../../repositories/CompanyRepository";
import { RegisterUserInfo } from "../../types/CreateUserInfo";
import { getByEmail, getWithPasswordById, registerUser } from "../../repositories/UserRepository";
import { checkAuth } from "../../middleware/checkAuth";

dotenv.config();
const router = Router();
const secretHash = process.env.SECRET_HASH;

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	// Check if the owner exists
	const user = await getByEmail(email)
	if (!user) return res.status(401).json({ msg: "Invalid email or password" });

	// Check if the password is correct
	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if (!isPasswordCorrect) return res.status(401).json({ msg: "Invalid email or password" });

	// Generate an access token with user data
	const accessToken = jwt.sign(
		{
			userId: user.id,
			companyId: user.company.id,
			userName: user.first_name + " " + user.last_name,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "30d" }
	);


	const refreshToken = jwt.sign(
		{
			id: user.id,
			companyId: user.company.id,
			userName: user.first_name + " " + user.last_name,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "60d" }
	);
	// Return the access token and user data in the response
	// return res.status(404).json({ accessToken, userInfo: user });
	return res.status(200).json({
		access: accessToken,
		refresh: refreshToken,
		userInfo: {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone_number: user.phone_number,
			role: user.role,
			avatar: user.avatar,
			department_info: user.department_info,
			shift_start: user.shift_start,
			shift_end: user.shift_end
		},
		company: user.company
	});
};

// this is for any user wants to register to our services
// add company under the name of Company Name...
// add our departments inside CreateCompany function to the company newly created...
export const register = async (req: Request, res: Response) => {
	try {
		const {
			email,
			password,
			first_name,
			last_name,
			phone_number,
		} = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ msg: "User already exists" });
		}

		// Input Data
		const paramsData: RegisterUserInfo = {
			email,
			password: await bcrypt.hash(password, 10),
			first_name,
			last_name,
			phone_number,
		};
		// add new company under the name of 'Company Name'
		// inside CreateCompany i will create the departments as well
		const company = await createCompany("Company Name");
		if (!company)
			return res
				.status(404)
				.json({ msg: "Error occurred during initialization your Company" });

		// Now Create The user With The company Newly Created...
		const user = await registerUser(paramsData, company);
		if (!user) return res
			.status(400)
			.json({ msg: 'Error occurred during Creating New User' })

		// Generate an access token with user data
		const accessToken = jwt.sign(
			{
				userId: user.id,
				companyId: company.id,
				email: user.email,
				userName: user.first_name + " " + user.last_name,
			},
			secretHash as string,
			{ expiresIn: "30d" }
		);

		const refreshToken = jwt.sign(
			{
				userId: user.id,
				companyId: company.id,
				email: user.email
			},
			secretHash as string,
			{ expiresIn: "60d" }
		);

		return res.status(200).json({
			access: accessToken,
			refresh: refreshToken,
			userInfo: {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				phone_number: user.phone_number,
				role: user.role,
				avatar: user.avatar ? user.avatar : '',
				department_info: user.department_info ? user.department_info : {},
				shift_start: user.shift_start,
				shift_end: user.shift_end
			},
			company: user.company
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "Server error" });
	}
};

export const refreshToken = async (req: Request, res: Response) => {
	const { refresh } = req.body;
	try {
		const decoded = jwt.verify(refresh, secretHash as string) as JwtPayload;
		// Lookup the user in the database
		const userRepository = getRepository(User);
		const user = await userRepository
			.createQueryBuilder("user")
			.where("user.id = :id", { id: decoded.id })
			.leftJoinAndSelect("user.company", "company")
			.getOne();

		if (!user) {
			return res.status(401).json({ msg: "Invalid refresh token" });
		}

		// Generate a new access token
		const access = jwt.sign(
			{
				id: user.id,
				companyId: user.company.id,
				userName: user.first_name + " " + user.last_name,
				email: user.email
			},
			secretHash as string,
			{ expiresIn: "30d" }
		);

		// Return the new access token
		return res.status(200).json(access);
	} catch (err) {
		return res.status(401).json({ msg: "Invalid refresh token" });
	}
};

export const changePassword = async (req: Request, res: Response) => {
	const { oldPassword, newPassword } = req.body;
	const { userId } = req.userData!;

	const user = await getWithPasswordById(userId)
	if (!user) return res.status(401).json({ msg: "Invalid user Id" });

	// Check if the password is correct
	const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
	if (!isPasswordCorrect) return res.status(401).json({ msg: "Invalid email or password" });

	// Update Password.
	user.password = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;
	await user.save();

	// Generate an access token with user data
	const accessToken = jwt.sign(
		{
			userId: user.id,
			companyId: user.company.id,
			userName: user.first_name + " " + user.last_name,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "30d" }
	);


	const refreshToken = jwt.sign(
		{
			id: user.id,
			companyId: user.company.id,
			userName: user.first_name + " " + user.last_name,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "60d" }
	);
	// Return the access token and user data in the response
	// return res.status(404).json({ accessToken, userInfo: user });
	return res.status(200).json({
		access: accessToken,
		refresh: refreshToken,
		userInfo: {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone_number: user.phone_number,
			role: user.role,
			avatar: user.avatar,
		},
		company: user.company
	});
};


router.route("/login").post(login);
router.route("/register").post(register);
router.route("/refresh").post(refreshToken);
router.route("/password/change").post(checkAuth, changePassword);


export { router as AuthRouter };
