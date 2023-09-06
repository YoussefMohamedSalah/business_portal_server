import { getRepository } from "typeorm";
import { Customer } from "../entities/Customer";
import { CreateCustomerInfo } from "src/types/CreateCustomerInfo";
import { Company } from "src/entities/Company";

// DONE
export const createCustomer = async (
    createData: CreateCustomerInfo,
    company: Company
) => {
    const { customer_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = createData;
    // check if customer already exists
    if (!email) return null;
    const existingCustomer = await getByEmail(email);
    if (existingCustomer) return null;
    // create customer
    const customerRepository = getRepository(Customer);
    const customer = new Customer();
    if (customer_type) {
        customer.customer_type = customer_type;
    }
    customer.company_name = company_name ? company_name : '';
    customer.vat_on = vat_on ? vat_on : '';
    customer.representative = representative ? representative : '';
    customer.phone_number = phone_number ? phone_number : '';
    customer.email = email ? email : '';
    customer.country = country ? country : '';
    customer.city = city ? city : '';
    customer.area = area ? area : '';
    customer.street = street ? street : '';
    customer.building_number = building_number ? building_number : '';
    customer.postal_code = postal_code ? postal_code : '';
    customer.company = company;
    await customerRepository.save(customer);
    return customer;
};

// DONE
export const getById = async (id: string) => {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository
        .createQueryBuilder("customer")
        .where("customer.id = :id", { id: id })
        .getOne();
    return customer;
};

// DONE
export const getByEmail = async (email: string) => {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository
        .createQueryBuilder("customer")
        .where("customer.email = :email", { email: email })
        .getOne();
    return customer;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const customerRepository = getRepository(Customer);
    const customers = await customerRepository
        .createQueryBuilder("customer")
        .where("customer.companyId = :companyId", { companyId: companyId })
        .getMany();
    return customers;
};