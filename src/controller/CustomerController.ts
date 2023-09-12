import { Request, Response } from 'express';
import { createCustomer, getAllByCompanyId, getById } from '../repositories/CustomerRepository';
import { CreateCustomerInfo } from 'src/types/CreateCustomerInfo';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { validateUUID } from '../utils/validateUUID';

// DONE
export const addCustomer = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const createData: CreateCustomerInfo = req.body;
    // first get company by id
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
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const customer = await getById(id);
    if (customer) {
        return res.json(customer);
    }
    return res.status(404).json({ msg: "Customer not found" });
};

// DONE
export const updateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const customer = await getById(id);
    if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
    }
    const { customer_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
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
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    console.log({ id })
    const customer = await getById(id);
    if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
    }
    await customer.remove();
    return res.json({ msg: "Customer deleted" });
}

// DONE
export const getAllCompanyCustomers = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const customers = await getAllByCompanyId(companyId);
    return res.json(customers);
};
