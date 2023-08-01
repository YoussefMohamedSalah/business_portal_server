import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { verify, JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { createCompany } from "../../repositories/CompanyRepository";
import { CreateUserInfo } from "../../types/user/CreateUserInfo";
import { createUser } from "../../repositories/UserRepository";
import { Company } from "../../entities/Company";

dotenv.config();
const router = Router();
const secretHash = process.env.SECRET_HASH;

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	// Check if the owner exists
	const user = await User.findOne({ where: { email } });
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
			id: user.id,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "30d" }
	);


	const refreshToken = jwt.sign(
		{
			id: user.id,
			email: user.email
		},
		secretHash as string,
		{ expiresIn: "60d" }
	);
	// Return the access token and user data in the response
	// return res.json({ accessToken, userInfo: user });
	return res.json({
		access: accessToken,
		refresh: refreshToken,
		userInfo: {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone_number: user.phone_number,
			role: user.role,
			picture: "",
		}
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
			role,
			first_name,
			last_name,
			phone_number,
			address,
			working_hours,
			contract_date,
			contract_ex,
			renewal_of_residence,
			project,
			id_number,
			id_ex_date,
			salary_per_month,
			salary_per_hour,
			sign,
			picture,
			file,
			// this for company relation
			companyId
		} = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Input Data
		const paramsData: CreateUserInfo = {
			email,
			password: await bcrypt.hash(password, 10),
			role,
			first_name,
			last_name,
			phone_number,
			address,
			working_hours,
			contract_date,
			contract_ex,
			renewal_of_residence,
			project,
			id_number,
			id_ex_date,
			salary_per_month,
			salary_per_hour,
			sign,
			picture,
			file,
			company: companyId
		};

		// first check if is owner or is user
		if (role && role === "owner") {
			// add new company under the name of 'Company Name'
			// inside CreateCompany i will create the departments as well
			const company = await createCompany("Company Name");
			if (!company)
				return res
					.status(404)
					.json({ msg: "Error occurred during initialization your Company" });
			// Now Create The user With The company Newly Created...
			const user = await createUser({ ...paramsData, company: company });
			if (!user) return res
				.status(400)
				.json({ msg: 'Error occurred during Creating New User' })

			// Generate an access token with user data
			const accessToken = jwt.sign(
				{
					id: user.id,
					email: user.email
				}, 
				secretHash as string,
				{ expiresIn: "30d" }
			);

			const refreshToken = jwt.sign(
				{
					id: user.id,
					email: user.email
				},
				secretHash as string,
				{ expiresIn: "60d" }
			);


			return res.json({
				access: accessToken,
				refresh: refreshToken,
				userInfo: {
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					phone_number: user.phone_number,
					role: user.role,
					picture: ""
				}
			});

		} else if (role && role !== 'owner') {
			// first get company by id, then add it to the newly created user
			const company = await Company.findOne({ where: { id: companyId } });
			if (!company) {
				return res.status(400).json({ message: "Company does not exists" });
			}
			// if company exists add it to the user
			const user = await createUser({ ...paramsData, company: company });
			if (!user) return res
				.status(400)
				.json({ msg: 'Error occurred during Creating New User' })
			else return res
				.status(201)
				.json({ msg: 'New User Created Successfully' })
		} else return res
			.status(400)
			.json({ msg: 'Host User Role Is Not Defined' })
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server error" });
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
			.getOne();

		if (!user) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		// Generate a new access token
		const access = jwt.sign(
			{
				id: user.id,
				email: user.email
			},
			secretHash as string,
			{ expiresIn: "30d" }
		);

		// Return the new access token
		return res.json(access);
	} catch (err) {
		return res.status(401).json({ message: "Invalid refresh token" });
	}
};


router.route("/login").post(login);
router.route("/register").post(register);
router.route("/refresh").post(refreshToken);

export { router as AuthRouter };
