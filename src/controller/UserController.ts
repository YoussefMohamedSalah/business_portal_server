import { Request, Response } from "express";
import {
	getAllCompanyUsers,
	getAllDepartmentUsers,
	getById,
} from "../repositories/UserRepository";
import bcrypt from "bcrypt";

// // done
// export const addUser = async (req: Request, res: Response) => {
//     const { ownerId } = req.params;
//     // permissions is an array of permission ids
//     const { name, email, password, phone, role, permissions, storeId } = req.body;

//     // first to get the owner to be sent to the new created customer
//     const owner = await getOwnerById(Number(ownerId));
//     if (!owner) return res.status(404).json({ msg: "Owner not found" });
//     // then check if the owner has the store that the customer will be added to it

//     const store = await getStoreById(Number(storeId));
//     if (!store) return res.status(404).json({ msg: "Store not found" });

//     // now will get all permissions and check if the permissions that sent in the request are exist
//     if (permissions.length !== 0) {
//         const allPermissions = await getAllPermissionsCategories(Number(ownerId));
//         const selectedPermissions = allPermissions.filter((permission) => permissions.includes(permission.id));
//         if (selectedPermissions.length !== permissions.length) {
//             return res.status(404).json({ msg: "Permission not found" });
//         }
//         const customer = await createCustomer(name, email, password, phone, role, allPermissions, store, owner);
//         if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
//         else return res.json(customer);
//     } else {
//         const customer = await createCustomer(name, email, password, phone, role, [], store, owner);
//         if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
//         else return res.json(customer);
//     }
// };


// DONE
export const getUserById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = await getById(id);
	if (user) {
		return res.json(user);
	}
	return res.status(404).json({ msg: "User not found" });
};

//DONE
export const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;

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
		picture,
		file,
		permissions
	} = req.body;
	user.first_name = first_name ? first_name : user.first_name;
	user.last_name = last_name ? last_name : user.last_name;
	user.business_title = business_title ? business_title : user.business_title;
	user.email = email ? email : user.email;
	user.password = password ? await bcrypt.hash(password, 10) : user.password;
	user.string_password = password ? password : user.password;
	user.address = address ? address : user.address;
	user.phone_number = phone_number ? phone_number : user.phone_number;
	user.working_hours = working_hours ? working_hours : user.working_hours;
	user.contract_date = contract_date ? contract_date : user.contract_date;
	user.contract_ex = contract_ex ? contract_ex : user.contract_ex;
	user.renewal_of_residence = renewal_of_residence ? renewal_of_residence : user.renewal_of_residence;
	user.id_number = id_number ? id_number : user.id_number;
	user.id_ex_date = id_ex_date ? id_ex_date : user.id_ex_date;
	user.salary_per_month = salary_per_month ? salary_per_month : user.salary_per_month;
	user.salary_per_hour = salary_per_hour ? salary_per_hour : user.salary_per_hour;
	user.sign = sign ? sign : user.sign;
	user.picture = picture ? picture : user.picture;
	user.file = file ? file : user.file;
	user.permissions = permissions ? permissions : user.permissions;
	user.role = role ? role : user.role;
	await user.save();
	return res.json(user);
};

// DONE
export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await getById(id);
	if (!user) {
		return res.status(404).json({ msg: "User not found" });
	}
	await user.remove();
	return res.json({ msg: "User deleted" });
};

// DONE
// all users for single company
export const getCompanyUsers = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	const users = await getAllCompanyUsers(companyId);
	return res.json(users);
};

// DONE
// all users for single department
export const getDepartmentUsers = async (req: Request, res: Response) => {
	const { departmentId } = req.params;
	const users = await getAllDepartmentUsers(departmentId);
	return res.json(users);
};
