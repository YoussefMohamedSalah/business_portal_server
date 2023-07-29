// here i will create company...
// then i will create departments...
// then i will create permissions...


// any company will take all departments available.
// any department will take all permissions available.




// user will take list of departments.
// user will take list of permissions.

import { Request, Response } from 'express';
import { createCompany, getById } from '../repositories/CompanyRepository';
import bcrypt from "bcrypt";


export const addInitialData = async (req: Request, res: Response) => {
    const { name } = req.body;
    const company = await createCompany(name);
    if (!company) return res.status(409).json({ msg: "User with same email already exists" });
    else return res.json(company);

    // // first to get the owner to be sent to the new created customer
    // const owner = await getOwnerById(Number(ownerId));
    // if (!owner) return res.status(404).json({ msg: "Owner not found" });
    // // then check if the owner has the store that the customer will be added to it

    // const store = await getStoreById(Number(storeId));
    // if (!store) return res.status(404).json({ msg: "Store not found" });

    // // now will get all permissions and check if the permissions that sent in the request are exist
    // if (permissions.length !== 0) {
    //     const allPermissions = await getAllPermissionsCategories(Number(ownerId));
    //     const selectedPermissions = allPermissions.filter((permission) => permissions.includes(permission.id));
    //     if (selectedPermissions.length !== permissions.length) {
    //         return res.status(404).json({ msg: "Permission not found" });
    //     }
    //     const customer = await createCustomer(name, email, password, phone, role, allPermissions, store, owner);
    //     if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
    //     else return res.json(customer);
    // } else {
    //     const customer = await createCustomer(name, email, password, phone, role, [], store, owner);
    //     if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
    //     else return res.json(customer);
    // }
};

export const addInitialDataOk = async (req: Request, res: Response) => {
    // const { ownerId } = req.params;
    // permissions is an array of permission ids
    // const { name, email, password, phone, role, permissions, storeId, ownerId } = req.body;
    const { name } = req.body;
    const company = await createCompany(name);
    if (!company) return res.status(409).json({ msg: "User with same email already exists" });
    else return res.json(company);

    // // first to get the owner to be sent to the new created customer
    // const owner = await getOwnerById(Number(ownerId));
    // if (!owner) return res.status(404).json({ msg: "Owner not found" });
    // // then check if the owner has the store that the customer will be added to it

    // const store = await getStoreById(Number(storeId));
    // if (!store) return res.status(404).json({ msg: "Store not found" });

    // // now will get all permissions and check if the permissions that sent in the request are exist
    // if (permissions.length !== 0) {
    //     const allPermissions = await getAllPermissionsCategories(Number(ownerId));
    //     const selectedPermissions = allPermissions.filter((permission) => permissions.includes(permission.id));
    //     if (selectedPermissions.length !== permissions.length) {
    //         return res.status(404).json({ msg: "Permission not found" });
    //     }
    //     const customer = await createCustomer(name, email, password, phone, role, allPermissions, store, owner);
    //     if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
    //     else return res.json(customer);
    // } else {
    //     const customer = await createCustomer(name, email, password, phone, role, [], store, owner);
    //     if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
    //     else return res.json(customer);
    // }
};

export const getCompanyById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await getById(Number(id));
    if (company) {
        return res.json(company);
    }
    return res.status(404).json({ msg: "company not found" });
};

export const updateCompany = async (req: Request, res: Response) => {
    const { id } = req.params;

    const company = await getById(Number(id));
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    const { name } = req.body;
    company.name = name ? name : company.name;
    await company.save();
    return res.json(company);
};

export const deleteCompany = async (req: Request, res: Response) => {
    const { id } = req.params;

    const company = await getById(Number(id));
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    await company.remove();
    return res.json({ msg: "Company deleted" });
}
