import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { Company } from "../entities/Company";
import { Role } from "../enums/enums";
import { CreateUserInfo, RegisterUserInfo } from "../types/CreateUserInfo";
import { getGroupByProjectId } from './GroupRepository';


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
	user.role = Role.SUPERUSER;
	user.company_info = { id: company.id, name: company.name }
	user.company = company;
	await userRepository.save(user);
	return user;
};

// DONE
export const createUser = async (paramsData: CreateUserInfo, avatar: any) => {
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
		salary_per_month,
		shift_start,
		shift_end,
		gender,
		department,
		company,
		password
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
	password && (user.password = password);
	user.projects_info = projects_info_arr,
		user.department_info = { id: department.id, name: department.name };
	user.company_info = { id: company.id, name: company.name }
	user.avatar = avatar ? avatar.path : '';
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
				if (!group) continue;
				group.members_count = group.members_count + 1;
				group.members = [...group.members, user];
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
			"user.avatar",
			"user.department_info",
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
			"user.role",
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
			"user.company_info",
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
			"user.role",
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
export const getWithGroupsById = async (id: string) => {
	const userRepository = getRepository(User);
	const user = await userRepository
		.createQueryBuilder("user")
		.where("user.id = :id", { id: id })
		.leftJoinAndSelect(
			"user.groups",
			"group"
		)
		.getOne();
	return user;
};

// DONE
export const getWithPasswordById = async (id: string) => {
	const userRepository = getRepository(User);
	const user = await userRepository
		.createQueryBuilder("user")
		.where("user.id = :id", { id: id })
		.select([
			"user.id",
			"user.password",
			"user.user_id",
			"user.first_name",
			"user.last_name",
			"user.email",
			"user.avatar",
			"user.role"
		])
		.leftJoinAndSelect(
			"user.company",
			"company"
		)
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
			"user.role",
			"user.is_verified",
			"user.shift_start",
			"user.shift_end",
			"user.gender",
			"user.projects_info",
			"user.department_info",
		])
		.orderBy("user.createdAt", "DESC")
		.getMany();
	return users;
};

// DONE
export const getAllEmployeesWithGroups = async (companyId: string) => {
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
			"user.phone_number",
			"user.avatar",
			"user.role",
			"user.department_info",
		])
		.leftJoinAndSelect('user.groups', 'group')
		.orderBy("user.createdAt", "DESC")
		.getMany();
	return users;
}

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
			"user.role",
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
				"user.role",
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
		.where("user.role != :role", { role: Role.USER })
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
			"user.role",
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