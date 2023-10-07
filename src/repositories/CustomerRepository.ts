import { getRepository } from "typeorm";
import { Customer } from "../entities/Customer";
import { CreateCustomerInfo } from "../types/CreateCustomerInfo";
import { Company } from "../entities/Company";
import { processNumber } from "../utils/checkAndParse";
import { ErrorMessages } from "../enums/enums";

export const createCustomer = async (
    createData: CreateCustomerInfo,
    company: Company
) => {
    const { customer_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = createData;
    if (!email) return null;
    try {
        const existingCustomer = await getByEmail(email);
        if (existingCustomer) return null;
        // create customer
        const customerRepository = getRepository(Customer);
        const customer = new Customer();
        if (customer_type) {
            customer.customer_type = customer_type;
        }

        let toCheckType: { [key: string]: number | string | undefined } = {
            vat_on: processNumber('Vat', vat_on!),
            postal_code: processNumber('Postal Code', postal_code!),
        };

        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        if (toCheckType.vat_on) customer.vat_on = toCheckType.vat_on as number;
        if (toCheckType.postal_code) customer.postal_code = toCheckType.postal_code as number;

        customer.company_name = company_name ? company_name : '';
        customer.representative = representative ? representative : '';
        customer.phone_number = phone_number ? phone_number : '';
        customer.email = email ? email : '';
        customer.country = country ? country : '';
        customer.city = city ? city : '';
        customer.area = area ? area : '';
        customer.street = street ? street : '';
        customer.building_number = building_number ? building_number : '';
        customer.company = company;
        await customerRepository.save(customer);
        return customer;
    } catch (error) {
        // Handle the error
        console.error("Error Adding Customer:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const customerRepository = getRepository(Customer);
        const customer = await customerRepository
            .createQueryBuilder("customer")
            .where("customer.id = :id", { id: id })
            .getOne();
        return customer;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Customer:", error);
        return;
    }
};

export const getByEmail = async (email: string) => {
    try {
        const customerRepository = getRepository(Customer);
        const customer = await customerRepository
            .createQueryBuilder("customer")
            .where("customer.email = :email", { email: email })
            .getOne();
        return customer;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Customer:", error);
        return;
    }
};

export const getAllByCompanyId = async (companyId: string) => {
    try {
        const customerRepository = getRepository(Customer);
        const customers = await customerRepository
            .createQueryBuilder("customer")
            .where("customer.companyId = :companyId", { companyId: companyId })
            .orderBy("customer.createdAt", "DESC")
            .getMany();
        return customers;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Customer:", error);
        return;
    }
};