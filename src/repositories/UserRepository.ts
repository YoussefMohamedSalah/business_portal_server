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
		company
	} = paramsData;

	// adding New User info + company newly created
	const userRepository = getRepository(User);
	const user = new User();
	user.email = email;
	user.password = password;
	user.first_name = first_name;
	user.last_name = last_name;
	user.phone_number = phone_number;
	user.address = address;
	user.working_hours = working_hours;
	user.contract_date = contract_date;
	user.contract_ex = contract_ex;
	user.renewal_of_residence = renewal_of_residence;
	user.project = project;
	user.id_number = id_number;
	user.id_ex_date = id_ex_date;
	user.salary_per_month = salary_per_month;
	user.salary_per_hour = salary_per_hour;
	user.sign = sign;
	user.picture = picture;
	user.file = file;
	user.role = role;
	user.company = company;
	await userRepository.save(user);
	return user;
};

// export const getAllCustomersForOwner = async (ownerId: number) => {
// 	const customerRepository = getRepository(Customer);
// 	const customers = await customerRepository
// 		.createQueryBuilder("customer")
// 		.where("customer.owner = :ownerId", { ownerId: ownerId })
// 		.leftJoinAndSelect(
// 			"customer.permissionsCategories",
// 			"permissionsCategories"
// 		)
// 		.getMany();
// 	return customers;
// };

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

export const getAllDepartmentUsers = async (departmentId: string) => {
	const userRepository = getRepository(User);
	const users = await userRepository
		.createQueryBuilder("user")
		.where("user.department = :departmentId", { departmentId: departmentId })
		.getMany();
	return users;
};
