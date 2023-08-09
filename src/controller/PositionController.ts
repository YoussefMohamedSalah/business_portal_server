import { Request, Response } from 'express';
import {getById } from '../repositories/UserRepository';


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
