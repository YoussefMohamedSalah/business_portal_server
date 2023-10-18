import dotenv from "dotenv";
import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getUserAndCompanyById, getById as getUserById } from '../repositories/UserRepository';
import { sendEmail } from "../helpers/sendEmail";
import { generateOTP } from "../utils/generateTempPassword";


dotenv.config();

// DONE
export const sendOtp = async (req: Request, res: Response) => {
    const { userId, companyId } = req.userData!;
    console.log('fired')
    try {
        const otp: number = generateOTP();
        console.log("Generated OTP:", otp);

        const user = await getUserById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });
        user.temp_otp = otp;
        await user.save();

        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });

        return sendEmail(user.email, 'Verify your email for Portal-CP',
            `Hi ${user.first_name} ${user.last_name},
Your Management Account At ${company.name} Has been created,

Your Verification Code is: ${otp}

Thanks,
Your Portal-CP Team.`
        );
    } catch (error) {
        console.error("Error Updating Position:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }

};

// DONE
export const verifyOtp = async (req: Request, res: Response) => {
    const { userId, companyId } = req.userData!;
    const { token } = req.params!;
    try {
        const user = await getUserById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });
        if (user.temp_otp !== Number(token)) return res.status(404).json({ msg: 'Invalid Otp Token' })
        user.temp_otp = 0;
        user.is_verified = true;
        await user.save();

        // verify email, and set step to 2
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });

        // this is automatic when user reach this point
        company.stepper_step = 2;
        await company.save();

        return res.status(200).json(company);
    } catch (error) {
        console.error("Error Verifying User:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// DONE **
export const updateUserPosition = async (req: Request, res: Response) => {
    const { userId, companyId } = req.userData!;
    const { business_title } = req.body;
    try {

        const user = await getUserById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });
        user.business_title = business_title ? business_title : user.business_title;
        await user.save();

        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });

        // this is automatic when user reach this point
        company.stepper_step = 1;
        await company.save();

        return res.status(404).json({
            msg: 'success'
        });
    } catch (error) {
        console.error("Error Updating Position:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// DONE **
export const updateCompany = async (req: Request, res: Response) => {
    const { companyId, userId } = req.userData!;
    const { name, address, size } = req.body;
    try {
        const user = getUserAndCompanyById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });

        company.name = name ? name : company.name;
        company.address = address ? address : company.address;
        company.size = size ? size : company.size;
        if (req.file) company.logo = req.file.path ? req.file.path : company.logo;

        // this is automatic when user reach this point
        company.stepper_state = true;
        company.stepper_step = 3;
        company.is_verified = true;
        await company.save();

        return res.status(200).json(company);
    } catch (error) {
        console.error("Error Updating Company:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
