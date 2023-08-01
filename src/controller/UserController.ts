import { Request, Response } from 'express';
import { getAllStoreCustomers, createCustomer, getById, getAllCustomersForOwner } from '../repositories/CustomerRepository';
import { getById as getOwnerById } from '../repositories/OwnerRepository';
import { getById as getStoreById } from '../repositories/BusinessRepository';
import { getAllPermissionsCategories } from '../repositories/PermissionCategoryRepository';
import bcrypt from "bcrypt";


// done
export const addUser = async (req: Request, res: Response) => {
    const { ownerId } = req.params;
    // permissions is an array of permission ids
    const { name, email, password, phone, role, permissions, storeId } = req.body;

    // first to get the owner to be sent to the new created customer
    const owner = await getOwnerById(Number(ownerId));
    if (!owner) return res.status(404).json({ msg: "Owner not found" });
    // then check if the owner has the store that the customer will be added to it

    const store = await getStoreById(Number(storeId));
    if (!store) return res.status(404).json({ msg: "Store not found" });

    // now will get all permissions and check if the permissions that sent in the request are exist
    if (permissions.length !== 0) {
        const allPermissions = await getAllPermissionsCategories(Number(ownerId));
        const selectedPermissions = allPermissions.filter((permission) => permissions.includes(permission.id));
        if (selectedPermissions.length !== permissions.length) {
            return res.status(404).json({ msg: "Permission not found" });
        }
        const customer = await createCustomer(name, email, password, phone, role, allPermissions, store, owner);
        if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
        else return res.json(customer);
    } else {
        const customer = await createCustomer(name, email, password, phone, role, [], store, owner);
        if (!customer) return res.status(409).json({ msg: "User with same email already exists" });
        else return res.json(customer);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await getById(Number(id));
    if (customer) {
        return res.json(customer);
    }
    return res.status(404).json({ msg: "Customer not found" });
};

// 
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await getById(Number(id));
    if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
    }
    const { name, email, password, phone, role } = req.body;
    customer.name = name ? name : customer.name;
    customer.email = email ? email : customer.email;
    customer.password = password ? await bcrypt.hash(password, 10) : customer.password;
    customer.string_password = password ? password : customer.password;
    customer.phone = phone ? phone : customer.phone;
    customer.role = role ? role : customer.role;
    await customer.save();
    return res.json(customer);
};

// done
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await getById(Number(id));
    if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
    }
    await customer.remove();
    return res.json({ msg: "Customer deleted" });
}

// all customers for single store
export const getAllUsers = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const customers = await getAllStoreCustomers(Number(storeId));
    return res.json(customers);
};

// // all customers for owner

// export const allCustomersForOwner = async (req: Request, res: Response) => {
//     const { ownerId } = req.params;
//     const customers = await getAllCustomersForOwner(Number(ownerId));
//     return res.json(customers);
// }
// 