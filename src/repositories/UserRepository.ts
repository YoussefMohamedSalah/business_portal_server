import { getRepository } from "typeorm";
import { Customer } from "../entities/Customer";
import { Role } from "../enums/enums";
import { User } from "../entities/User";

import bcrypt from "bcrypt";
import { CreateUserInfo } from "../types/CreateUserInfo";
import { getRoleFromString } from "../utils/getRoleFromString";
// import dotenv from "dotenv";

// dotenv.config();
// const secretHash = process.env.SECRET_HASH;

// *New* - This is a new method that we are adding to the repository
export const createUser = async (paramsData: CreateUserInfo) => {
	const {
		first_name,
		last_name,
		business_title,
		email,
		password,
		string_password,
		address,
		phone_number,
		contract_date,
		contract_ex,
		renewal_of_residence,
		project,
		id_number,
		id_ex_date,
		salary_per_month,
		salary_per_hour,
		role,
		sign,
		picture,
		file,
		permissions,
		is_verified,
		working_hours,
		shift_start,
		shift_end,
		gender,
		company
	} = paramsData;

	// adding New User info + company newly created
	const userRepository = getRepository(User);
	const user = new User();
	user.email = email;
	user.password = password;
	user.first_name = first_name;
	user.last_name = last_name;
	string_password && (user.string_password = string_password);
	business_title && (user.business_title = business_title);
	phone_number && (user.phone_number = phone_number);
	address && (user.address = address);
	working_hours && (user.working_hours = working_hours);
	contract_date && (user.contract_date = contract_date);
	contract_ex && (user.contract_ex = contract_ex);
	renewal_of_residence && (user.renewal_of_residence = renewal_of_residence);
	project && (user.project = project);
	id_number && (user.id_number = id_number);
	id_ex_date && (user.id_ex_date = id_ex_date);
	salary_per_month && (user.salary_per_month = salary_per_month);
	salary_per_hour && (user.salary_per_hour = salary_per_hour);
	sign && (user.sign = sign);
	picture && (user.picture = picture);
	file && (user.file = file);
	role && (user.role = role);
	permissions && (user.permissions = permissions);
	is_verified && (user.is_verified = is_verified);
	shift_start && (user.shift_start = shift_start);
	shift_end && (user.shift_end = shift_end);
	gender && (user.gender = gender);
	user.company = company;
	await userRepository.save(user);
	return user;
};

// DONE
export const getByEmail = async (email: string) => {
	const userRepository = getRepository(User);
	const user = await userRepository
		.createQueryBuilder("user")
		.where("user.email = :email", { email: email })
		.leftJoinAndSelect(
			"user.company",
			"company"
		)
		.getOne();
	return user;
};

// DONE
export const getUserAndCompanyById = async (id: string) => {
	const userRepository = getRepository(User);
	const user = await userRepository
		.createQueryBuilder("user")
		.where("user.id = :id", { id: id })
		.leftJoinAndSelect(
			"user.company",
			"company"
		)
		.getOne();
	return user;
};

// DONE
export const getById = async (id: string) => {
	const userRepository = getRepository(User);
	const user = await userRepository
		.createQueryBuilder("user")
		.where("user.id = :id", { id: id })
		.getOne();
	return user;
};

// DONE
export const getAllCompanyUsers = async (companyId: string) => {
	const userRepository = getRepository(User);
	const users = await userRepository
		.createQueryBuilder("user")
		.where("user.company = :companyId", { companyId: companyId })
		.getMany();
	return users;
};

// DONE
export const getAllDepartmentUsers = async (departmentId: string) => {
	const userRepository = getRepository(User);
	const users = await userRepository
		.createQueryBuilder("user")
		.where("user.department = :departmentId", { departmentId: departmentId })
		.getMany();
	return users;
};

// DONE
export const getAllUsers = async (companyId: string) => {
	if (companyId === '') {
		const userRepository = getRepository(User);
		const users = await userRepository
			.createQueryBuilder("user")
			.where("user.role = :role", { role: Role.USER })
			.leftJoinAndSelect(
				"user.company",
				"company"
			)
			.getMany();
		return users;
	} else if (companyId && companyId !== '') {
		const userRepository = getRepository(User);
		const users = await userRepository
			.createQueryBuilder("user")
			.where("user.role = :role", { role: Role.USER })
			.andWhere("user.company = :companyId", { companyId: companyId })
			.getMany();
		return users;
	} else return;

}

// DONE
export const getAllManagers = async (companyId: string) => {
	const userRepository = getRepository(User);
	const users = await userRepository
		.createQueryBuilder("user")
		.where("user.is_manager = :is_manager", { is_manager: true })
		.andWhere("user.company = :companyId", { companyId: companyId })
		.getMany();
	return users;
}