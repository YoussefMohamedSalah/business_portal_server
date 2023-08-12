import { getRepository } from "typeorm";
import { Customer } from "../entities/Customer";

// DONE
export const createCustomer = async (
    createData: any
) => {
    const { name, supplier_type, company_name, vat_on, Representative, phone_number, email, country, city, area, street, building_number, postal_code } = createData;
    const customerRepository = getRepository(Customer);
    const customer = new Customer();
    customer.name = name ? name : '';
    customer.supplier_type = supplier_type ? supplier_type : '';
    customer.company_name = company_name ? company_name : '';
    customer.vat_on = vat_on ? vat_on : '';
    customer.Representative = Representative ? Representative : '';
    customer.phone_number = phone_number ? phone_number : '';
    customer.email = email ? email : '';
    customer.country = country ? country : '';
    customer.city = city ? city : '';
    customer.area = area ? area : '';
    customer.street = street ? street : '';
    customer.building_number = building_number ? building_number : null;
    customer.postal_code = postal_code ? postal_code : null;
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
