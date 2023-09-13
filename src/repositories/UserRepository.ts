import { getRepository } from "typeorm";
import { Customer } from "../entities/Customer";
import { Role } from "../enums/enums";
import { User } from "../entities/User";

import { CreateUserInfo, RegisterUserInfo } from "../types/CreateUserInfo";
import { getGroupByProjectId } from './GroupRepository';
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
	user.is_manager = true;
	user.role = Role.SUPERUSER;
	user.company = company;
	await userRepository.save(user);
	return user;
};

// DONE
export const createUser = async (paramsData: CreateUserInfo) => {
	const {
		first_name,
		last_name,
		business_title,
		email,
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
	user.first_name = first_name;
	user.last_name = last_name;
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

	// now add this user to project members
	if (projects && projects.length > 0) {
		for (let i = 0; i < projects.length; i++) {
			if (projects[i]) {
				const projectRepository = getRepository(Project);
				projects[i].members_count = projects[i].members_count + 1;
				await projectRepository.save(projects[i]);
				// Now get the group by projectId
				// then add this user to the group members
				const group = await getGroupByProjectId(projects[i].id);
				if (!group) return;
				group.members_count = group.members_count + 1;
				group.members.push({ id: user.id, name: user.first_name + ' ' + user.last_name });
				await group.save();
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
		.select([
			"user.id",
			"user.first_name",
			"user.last_name",
			"user.email",
			"user.password",
			"user.role",
			"user.phone_number",
			"user.avatar"
		])
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
		.select([
			"user.id",
			"user.user_id",
			"user.first_name",
			"user.last_name",
			"user.business_title",
			"user.email",
			"user.address",
			"user.phone_number",
			"user.working_hours",
			"user.contract_date",
			"user.contract_ex",
			"user.renewal_of_residence",
			"user.id_number",
			"user.id_ex_date",
			"user.salary_per_month",
			"user.salary_per_hour",
			"user.sign",
			"user.avatar",
			"user.file",
			"user.permissions",
			"user.role",
			"user.is_manager",
			"user.is_verified",
			"user.shift_start",
			"user.shift_end",
			"user.gender",
			"user.projects_info",
			"user.department_info"
		])
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
		.select([
			"user.id",
			"user.user_id",
			"user.first_name",
			"user.last_name",
			"user.business_title",
			"user.email",
			"user.address",
			"user.phone_number",
			"user.working_hours",
			"user.contract_date",
			"user.contract_ex",
			"user.renewal_of_residence",
			"user.id_number",
			"user.id_ex_date",
			"user.salary_per_month",
			"user.salary_per_hour",
			"user.sign",
			"user.avatar",
			"user.file",
			"user.permissions",
			"user.role",
			"user.is_manager",
			"user.is_verified",
			"user.shift_start",
			"user.shift_end",
			"user.gender",
			"user.projects_info",
			"user.department_info"
		])
		.getOne();
	return user;
};

// DONE
export const getAllCompanyUsers = async (companyId: string) => {
	const userRepository = getRepository(User);
	const users = await userRepository
		.createQueryBuilder("user")
		.where("user.company = :companyId", { companyId: companyId })
		.select([
			"user.id",
			"user.user_id",
			"user.first_name",
			"user.last_name",
			"user.business_title",
			"user.email",
			"user.address",
			"user.phone_number",
			"user.working_hours",
			"user.contract_date",
			"user.contract_ex",
			"user.renewal_of_residence",
			"user.id_number",
			"user.id_ex_date",
			"user.salary_per_month",
			"user.salary_per_hour",
			"user.sign",
			"user.avatar",
			"user.file",
			"user.permissions",
			"user.role",
			"user.is_manager",
			"user.is_verified",
			"user.shift_start",
			"user.shift_end",
			"user.gender",
			"user.projects_info",
			"user.department_info"
		])
		.orderBy("user.createdAt", "DESC")
		.getMany();
	return users;
};

// DONE
export const getAllDepartmentUsers = async (departmentId: string) => {
	const userRepository = getRepository(User);
	const users = await userRepository
		.createQueryBuilder("user")
		.where("user.department = :departmentId", { departmentId: departmentId })
		.select([
			"user.id",
			"user.user_id",
			"user.first_name",
			"user.last_name",
			"user.business_title",
			"user.email",
			"user.address",
			"user.phone_number",
			"user.working_hours",
			"user.contract_date",
			"user.contract_ex",
			"user.renewal_of_residence",
			"user.id_number",
			"user.id_ex_date",
			"user.salary_per_month",
			"user.salary_per_hour",
			"user.sign",
			"user.avatar",
			"user.file",
			"user.permissions",
			"user.role",
			"user.is_manager",
			"user.is_verified",
			"user.shift_start",
			"user.shift_end",
			"user.gender",
			"user.projects_info",
			"user.department_info"
		])
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
			.select([
				"user.id",
				"user.user_id",
				"user.first_name",
				"user.last_name",
				"user.business_title",
				"user.email",
				"user.address",
				"user.phone_number",
				"user.working_hours",
				"user.contract_date",
				"user.contract_ex",
				"user.renewal_of_residence",
				"user.id_number",
				"user.id_ex_date",
				"user.salary_per_month",
				"user.salary_per_hour",
				"user.sign",
				"user.avatar",
				"user.file",
				"user.permissions",
				"user.role",
				"user.is_manager",
				"user.is_verified",
				"user.shift_start",
				"user.shift_end",
				"user.gender",
				"user.projects_info",
				"user.department_info"
			])
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
		.select([
			"user.id",
			"user.user_id",
			"user.first_name",
			"user.last_name",
			"user.business_title",
			"user.email",
			"user.address",
			"user.phone_number",
			"user.working_hours",
			"user.contract_date",
			"user.contract_ex",
			"user.renewal_of_residence",
			"user.id_number",
			"user.id_ex_date",
			"user.salary_per_month",
			"user.salary_per_hour",
			"user.sign",
			"user.avatar",
			"user.file",
			"user.permissions",
			"user.role",
			"user.is_manager",
			"user.is_verified",
			"user.shift_start",
			"user.shift_end",
			"user.gender",
			"user.projects_info",
			"user.department_info"
		])
		.getMany();
	return users;
}