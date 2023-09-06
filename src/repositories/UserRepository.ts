import { getRepository } from "typeorm";
import { Customer } from "../entities/Customer";
import { Role } from "../enums/enums";
import { User } from "../entities/User";

import bcrypt from "bcrypt";
import { CreateUserInfo, RegisterUserInfo } from "../types/CreateUserInfo";
import { getRoleFromString } from "../utils/getRoleFromString";
import { Project } from "../entities/Project";
import { Company } from "../entities/Company";
// import dotenv from "dotenv";

// dotenv.config();
// const secretHash = process.env.SECRET_HASH;

// *New* - This is a new method that we are adding to the repository
export const registerUser = async (
	paramsData: RegisterUserInfo,
	company: Company
) => {
	const {
		first_name,
		last_name,
		email,
		password,
		phone_number,
	} = paramsData;

	// adding New User info + company newly created
	const userRepository = getRepository(User);
	const user = new User();
	user.email = email;
	user.password = password;
	user.first_name = first_name;
	user.last_name = last_name;
	phone_number && (user.phone_number = phone_number);
	user.company = company;
	await userRepository.save(user);
	return user;
};


export const createUser = async (paramsData: CreateUserInfo) => {
	const {
		first_name,
		last_name,
		business_title,
		email,
		password,
		string_password,
		phone_number,
		contract_date,
		contract_ex,
		projects,
		id_number,
		id_ex_date,
		shift_start,
		shift_end,
		gender,
		company,
		salary_per_month,
		department
	} = paramsData;

	let projects_info_arr = [];
	if (projects && projects.length > 0) {
		for (let i = 0; i < projects?.length; i++) {
			projects_info_arr.push({ id: projects[i].id, name: projects[i].name });
		}
	}

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
	contract_date && (user.contract_date = contract_date);
	contract_ex && (user.contract_ex = contract_ex);
	id_number && (user.id_number = id_number);
	id_ex_date && (user.id_ex_date = id_ex_date);
	salary_per_month && (user.salary_per_month = salary_per_month);
	shift_start && (user.shift_start = shift_start);
	shift_end && (user.shift_end = shift_end);
	gender && (user.gender = gender);
	user.projects_info = projects_info_arr,
		user.department_info = { id: department.id, name: department.name };
	user.department = department;
	user.company = company;
	await userRepository.save(user);

	// update company employee count
	const companyRepository = getRepository(Company);
	company.employee_count = company.employee_count + 1;
	if (user.gender === 'male') {
		company.men_count = company.men_count + 1;
	} else if (user.gender === 'female') {
		company.women_count = company.women_count + 1
	}
	await companyRepository.save(company);

	// now add this user to project members
	if (projects && projects.length > 0) {
		const projectRepository = getRepository(Project);
		for (let i = 0; i < projects.length; i++) {
			if (projects[i]) {
				projects[i].members_count = projects[i].members_count + 1;
				await projectRepository.save(projects[i]);
				const member_project = getRepository('project_members');
				await member_project.insert({
					project_id: projects[i].id,
					member_id: user.id
				});
			}
		}
	}
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
		// .leftJoinAndSelect(
		// 	"user.project",
		// 	"project"
		// )
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