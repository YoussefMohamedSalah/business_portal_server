
import { Request, Response } from 'express';
import {getById } from '../repositories/UserRepository';
import bcrypt from "bcrypt";


// export const addCompany = async (req: Request, res: Response) => {
//     const { name } = req.body;
//     const company = await createCompany(name);
//     if (!company) return res.status(409).json({ msg: "User with same email already exists" });
//     else return res.json(company);
// };

// export const getCompanyById = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const company = await getById(Number(id));
//     if (company) {
//         return res.json(company);
//     }
//     return res.status(404).json({ msg: "company not found" });
// };

export const updatePosition = async (req: Request, res: Response) => {
    const { userId, business_title } = req.body;

    const user = await getById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    user.business_title = business_title ? business_title : user.business_title;
    await user.save();
    return res.json(user);
};

// export const deleteCompany = async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const company = await getById(Number(id));
//     if (!company) {
//         return res.status(404).json({ msg: "Company not found" });
//     }
//     await company.remove();
//     return res.json({ msg: "Company deleted" });
// }
