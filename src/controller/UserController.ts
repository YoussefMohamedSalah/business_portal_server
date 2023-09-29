import { Request, Response } from "express";
import {
	createUser,
	getAllCompanyUsers,
	getAllDepartmentUsers,
	getById,
	getAllManagers,
	getAllEmployeesWithGroups
} from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { getById as getCompanyById } from "../repositories/CompanyRepository";
import { CreateUserInfo } from "../types/CreateUserInfo";
import { User } from "../entities/User";
import { getById as getDepartmentById } from "../repositories/DepartmentRepository";
import { getById as getProjectById } from "../repositories/ProjectRepository";
import { Project } from "../entities/Project";
import { Company } from "../entities/Company";
import { validateUUID } from '../utils/validateUUID';
import { sendEmail } from "../helpers/sendEmail";
import { generateTempPassword } from "../utils/generateTempPassword";

// DONE
export const addUser = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	// permissions is an array of permission ids
	const {
		first_name,
		last_name,
		business_title,
		email,
		projects,
		contract_date,
		contract_ex,
		id_number,
		id_ex_date,
		phone_number,
		shift_start,
		shift_end,
		gender,
		salary_per_month,
		departmentId,
	} = req.body;
	console.log(projects)

	// Check if the user already exists
	const existingUser = await User.findOne({ where: { email } });
	if (existingUser) {
		return res.status(400).json({ message: "User with same email already exists" });
	}

	const company = await getCompanyById(companyId);
	if (!company) return res.status(404).json({ msg: "Company not found" });

	const department = await getDepartmentById(departmentId);
	if (!department) return res.status(404).json({ msg: "Department not found" });

	let projects_arr: Project[] = [];
	if (projects && Array.isArray(projects) && projects.length > 0) {
		for (let i = 0; i < projects?.length; i++) {
			let project = await getProjectById(projects[i]);
			if (!project) return res.status(404).json({ msg: "Project not found" });
			projects_arr.push(project);
		}
	}

	let avatar = req.file!;
	const tempPassword = `${generateTempPassword()}`;

	// Input Data
	const paramsData: CreateUserInfo = {
		first_name,
		last_name,
		business_title,
		email,
		phone_number,
		contract_date,
		contract_ex,
		projects: projects_arr,
		id_number,
		id_ex_date,
		salary_per_month,
		shift_start,
		shift_end,
		gender,
		department,
		company,
		password: await bcrypt.hash(tempPassword, 10)
	}

	const user = await createUser(paramsData, avatar);
	sendEmail(email, 'Temp Password', `your Account Just created, logIn to our portal using email:${email} password:${tempPassword}`)

	if (!user) return res.status(409).json({ msg: "Field to Create Employee" });
	return res.json(user);
};

// DONE
export const getUserById = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	const user = await getById(id);
	if (user) return res.json(user);
	return res.status(404).json({ msg: "User not found" });
};

// DONE
export const getCurrentUser = async (req: Request, res: Response) => {
	const { userId } = req.userData!;
	const user = await getById(userId);
	if (user) return res.json(user);
	return res.status(404).json({ msg: "User not found" });
};

//DONE
export const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	const { companyId } = req.userData!;

	const user = await getById(id);
	if (!user) {
		return res.status(404).json({ msg: "User not found" });
	}
	const {
		first_name,
		last_name,
		business_title,
		email,
		password,
		address,
		phone_number,
		working_hours,
		contract_date,
		contract_ex,
		renewal_of_residence,
		id_number,
		id_ex_date,
		salary_per_month,
		salary_per_hour,
		role,
		sign,
		avatar,
		file,
		permissions,
		departmentId,
		gender,
	} = req.body;

	let department;
	if (departmentId) {
		department = await getDepartmentById(departmentId);
		if (!department) return res.status(404).json({ msg: "Department not found" });
	}

	if (gender && user.gender !== gender) {
		let company: Company | null = await getCompanyById(companyId)
		if (!company) return res.status(404).json({ msg: "Company not found" });
		if (user.gender === null && gender === 'Male') {
			company.male_count++;
			company.employee_count++;
		} else if (user.gender === null && gender === 'Female') {
			company.female_count++;
			company.employee_count++;
		} else if (user.gender === 'Male' && gender === 'Female') {
			company.female_count++;
			company.female_count--;
		} else if (user.gender === 'Female' && gender === 'Male') {
			company.female_count--;
			company.female_count++;
		}
		await company.save();
	}



	user.first_name = first_name ? first_name : user.first_name;
	user.last_name = last_name ? last_name : user.last_name;
	user.business_title = business_title ? business_title : user.business_title;
	user.email = email ? email : user.email;
	user.password = password ? await bcrypt.hash(password, 10) : user.password;
	user.address = address ? address : user.address;
	user.phone_number = phone_number ? phone_number : user.phone_number;
	user.working_hours = working_hours ? working_hours : user.working_hours;
	user.contract_date = contract_date ? contract_date : user.contract_date;
	user.contract_ex = contract_ex ? contract_ex : user.contract_ex;
	user.renewal_of_residence = renewal_of_residence
		? renewal_of_residence
		: user.renewal_of_residence;
	user.id_number = id_number ? id_number : user.id_number;
	user.id_ex_date = id_ex_date ? id_ex_date : user.id_ex_date;
	user.salary_per_month = salary_per_month
		? salary_per_month
		: user.salary_per_month;
	user.salary_per_hour = salary_per_hour
		? salary_per_hour
		: user.salary_per_hour;
	user.sign = sign ? sign : user.sign;
	user.avatar = avatar ? avatar : user.avatar;
	user.gender = gender ? gender : user.gender;
	user.file = file ? file : user.file;
	user.permissions = permissions ? permissions : user.permissions;
	user.role = role ? role : user.role;
	if (departmentId && department) {
		user.department = department ? department : user.department;
		user.department_info = department ? department : user.department_info;
	}
	await user.save();
	return res.json(user);
};

// DONE
export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	const user = await getById(id);
	if (!user) return res.status(404).json({ msg: "User not found" });
	await user.remove();
	return res.json({ msg: "User deleted" });
};

// DONE
export const getCompanyUsers = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	const users = await getAllCompanyUsers(companyId);
	return res.json(users);
};

// DONE
export const getDepartmentUsers = async (req: Request, res: Response) => {
	const { departmentId } = req.params;
	const users = await getAllDepartmentUsers(departmentId);
	return res.json(users);
};

// DONE
export const getManagers = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	const users = await getAllManagers(companyId);
	return res.json(users);
}

export const getAllWithGroups = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	const users = await getAllEmployeesWithGroups(companyId);
	return res.json(users);
}