import { Request, Response } from 'express';
import { createCustomer, getById } from '../repositories/CustomerRepository';
import { CreateCustomerInfo } from 'src/types/CreateCustomerInfo';
import { getById as getCompanyById } from '../repositories/CompanyRepository';

// DONE
export const addCustomer = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const createData: CreateCustomerInfo = req.body;
    // first get company by id
    if (companyId) return res.status(400).json({ msg: "Company id is required" });
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    // then create customer
    const customer = await createCustomer(createData, company);
    if (!customer) return res.status(409).json({ msg: "Customer already exists" });
    else return res.json(customer);
};

// DONE
export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await getById(id);
    if (customer) {
        return res.json(customer);
    }
    return res.status(404).json({ msg: "Customer not found" });
};

// DONE
export const updateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await getById(id);
    if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
    }
    const { name, customer_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
    customer.name = name ? name : customer.name;
    customer.customer_type = customer_type ? customer_type : customer.customer_type;
    customer.company_name = company_name ? company_name : customer.company_name;
    customer.vat_on = vat_on ? vat_on : customer.vat_on;
    customer.representative = representative ? representative : customer.representative;
    customer.phone_number = phone_number ? phone_number : customer.phone_number;
    customer.email = email ? email : customer.email;
    customer.country = country ? country : customer.country;
    customer.city = city ? city : customer.city;
    customer.area = area ? area : customer.area;
    customer.street = street ? street : customer.street;
    customer.building_number = building_number ? building_number : customer.building_number;
    customer.postal_code = postal_code ? postal_code : customer.postal_code;
    await customer.save();
    return res.json(customer);
};

// DONE
export const deleteCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await getById(id);
    if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
    }
    await customer.remove();
    return res.json({ msg: "Customer deleted" });
}

export const getAllCompanyCustomers = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const company = await getCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    const customers = company.customers;
    return res.json(customers);
};
