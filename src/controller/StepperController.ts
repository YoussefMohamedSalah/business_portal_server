import dotenv from "dotenv";
import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'your_email_service_provider',
    auth: {
        user: 'your_email',
        pass: 'your_password',
    },
});

// DONE
export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    const otp = speakeasy.totp({
        secret: 'heo2e36de354dd354dd3842',
        digits: 6,
    });

    const mailOptions: nodemailer.SendMailOptions = {
        from: 'portal_cp',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send OTP');
        } else {
            console.log('Email sent:', info.response);
            res.send('OTP sent successfully');
        }
    });
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
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    const { business_title, companyId } = req.body;
    user.business_title = business_title ? business_title : user.business_title;
    await user.save();

    const company = await getCompanyById(companyId);
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    company.stepper_step = 1;
    await company.save();
    return res.json(user);
};

// DONE **
export const updateCompany = async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await getCompanyById(id);
    if (!company) {
        return res.status(404).json({ msg: "Company not found" });
    }
    const { name, address, logo, size } = req.body;
    company.name = name ? name : company.name;
    company.address = address ? address : company.address;
    company.logo = logo ? logo : company.logo;
    company.size = size ? size : company.size;
    // this is automatic when user reach this point
    company.stepper_state = true;
    company.stepper_step = 3;
    await company.save();
    return res.json(company);
};
