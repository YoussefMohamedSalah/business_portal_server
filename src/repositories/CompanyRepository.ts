import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import bcrypt from "bcrypt";
// import dotenv from "dotenv";

// dotenv.config();
// const secretHash = process.env.SECRET_HASH;


// export const getAllStoreCustomers = async (storeId: number) => {
// 	const customerRepository = getRepository(Customer);
// 	const customers = await customerRepository
// 		.createQueryBuilder("customer")
// 		.where("customer.store = :storeId", { storeId: storeId })
// 		.getMany();
// 	return customers;
// };

// export const getAllCustomersForOwner = async (ownerId: number) => {
// 	const customerRepository = getRepository(Customer);
// 	const customers = await customerRepository.createQueryBuilder('customer')
// 		.where('customer.owner = :ownerId', { ownerId: ownerId })
// 		.leftJoinAndSelect('customer.permissionsCategories', 'permissionsCategories')
// 		.getMany();
// 	return customers;
// };

// export const createCustomer = async (
// 	name: string,
// 	email: string,
// 	password: string,
// 	phone: string,
// 	role: Role,

// 	owner: Owner
// ) => {

// 	// first check if customer with same email exists
// 	const customerWithSameEmail = await getByEmail(email);
// 	// that means customer with same email already exists
// 	if (customerWithSameEmail) return;

// 	// now will add permissions and add it to the new created users
// 	const customerRepository = getRepository(Customer);
// 	const customer = new Customer();
// 	customer.name = name;
// 	customer.email = email;
// 	customer.password = await bcrypt.hash(password, 10);
// 	customer.string_password = password;
// 	customer.phone = phone;
// 	customer.owner = owner;
// 	customer.role = role ? role : Role.Associate;
// 	await customerRepository.save(customer);
// 	return customer;
// };

// // export const getById = async (id: number) => {
// // 	const customerRepository = getRepository(Customer);
// // 	const customer = await customerRepository
// // 		.createQueryBuilder("customer")
// // 		.where("customer.id = :id", { id: id })
// // 		.getOne();
// // 	return customer;
// // };

// export const getByEmail = async (email: string) => {
// 	const customerRepository = getRepository(Customer);
// 	const customer = await customerRepository
// 		.createQueryBuilder("customer")
// 		.where("customer.email = :email", { email: email })
// 		.getOne();
// 	return customer;
// };

// -------------------------
export const createCompany = async (
    name: string,
) => {

    // // first check if customer with same email exists
    // const customerWithSameEmail = await getByEmail(name);
    // // that means customer with same email already exists
    // if (customerWithSameEmail) return;

    // now will add permissions and add it to the new created users
    const companyRepository = getRepository(Company);
    const company = new Company();
    company.name = name;
    await companyRepository.save(company);
    return company;
};

export const getById = async (id: number) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .getOne();
    return company;
};
