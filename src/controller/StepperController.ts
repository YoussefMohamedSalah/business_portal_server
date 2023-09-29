import dotenv from "dotenv";
import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';


dotenv.config();


// DONE
export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
};

// DONE
export const verifyOtp = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { email, companyId } = req.body;

    // verify email, and set step to 2
    const company = await getCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    // this is automatic when user reach this point
    company.stepper_state = false;
    company.stepper_step = 2;
    await company.save();
    // const verified = speakeasy.totp.verify({
    //     secret: '<YourSecretKey>',
    //     encoding: 'base32',
    //     token: token,
    //     window: 6,
    // });

    // if (verified) {
    //     res.send('OTP verified successfully');
    // } else {
    //     res.status(400).send('Invalid OTP');
    // }
    return res.json(company);
};

// DONE **
export const updateUserPosition = async (req: Request, res: Response) => {
    const { userId, companyId } = req.userData!;
    const { business_title } = req.body;
    const user = await getUserById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    user.business_title = business_title ? business_title : user.business_title;
    await user.save();

    const company = await getCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    company.stepper_step = 1;
    await company.save();
    return res.json({
        msg: 'success'
    });
};

// DONE **
export const updateCompany = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const { name, address, size } = req.body;
    company.name = name ? name : company.name;
    company.address = address ? address : company.address;
    company.size = size ? size : company.size;
    if (req.file) {
        company.logo = req.file.path ? req.file.path : company.logo;
    }
    // this is automatic when user reach this point
    company.stepper_state = true;
    company.stepper_step = 3;
    await company.save();
    return res.json(company);
};
