import { Request, Response } from 'express';
import { createCustomer, getAllByCompanyId, getById } from '../repositories/CustomerRepository';
import { CreateCustomerInfo } from '../types/CreateCustomerInfo';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { validateUUID } from '../utils/validateUUID';
import { processNumber } from '../utils/checkAndParse';

export const addCustomer = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { customer_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
    try {

        let toCheckType: { [key: string]: number | string | undefined } = {
            vat_on: vat_on && processNumber('Vat', vat_on!),
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
        };

        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        const createData: CreateCustomerInfo = {
            customer_type, company_name,
            vat_on: toCheckType.vat_on ? toCheckType.vat_on as number : 0,
            postal_code: toCheckType.postal_code ? toCheckType.postal_code as number : 0,
            representative, phone_number, email, country, city, area, street, building_number,
        };
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });
        const customer = await createCustomer(createData, company);
        if (!customer) return res.status(409).json({ msg: "Customer already exists" });
        return res.status(200).json(customer);
    } catch (error) {
        console.error("Error Adding Customer:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const customer = await getById(id);
        if (!customer) return res.status(404).json({ msg: "Customer not found" });
        return res.status(200).json(customer);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Customer:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

    try {
        const customer = await getById(id);
        if (!customer) return res.status(404).json({ msg: "Customer not found" });
        const { customer_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;

        let toCheckType: { [key: string]: number | string | undefined } = {
            vat_on: vat_on && processNumber('Vat', vat_on!),
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
        };

        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }
        if (toCheckType.vat_on) customer.vat_on = toCheckType.vat_on as number;
        if (toCheckType.postal_code) customer.postal_code = toCheckType.postal_code as number;

        customer.customer_type = customer_type ? customer_type : customer.customer_type;
        customer.company_name = company_name ? company_name : customer.company_name;
        customer.representative = representative ? representative : customer.representative;
        customer.phone_number = phone_number ? phone_number : customer.phone_number;
        customer.email = email ? email : customer.email;
        customer.country = country ? country : customer.country;
        customer.city = city ? city : customer.city;
        customer.area = area ? area : customer.area;
        customer.street = street ? street : customer.street;
        customer.building_number = building_number ? building_number : customer.building_number;
        await customer.save();
        return res.status(200).json(customer);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Customer:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const customer = await getById(id);
        if (!customer) return res.status(404).json({ msg: "Customer not found" });
        await customer.remove();
        return res.status(404).json({ msg: "Customer deleted" });
    } catch (error) {
        console.error("Error Deleting Customer:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}


export const getAllCompanyCustomers = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const customers = await getAllByCompanyId(companyId);
        return res.status(200).json(customers);
    } catch (error) {
        console.error("Error Retrieving Customers:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
