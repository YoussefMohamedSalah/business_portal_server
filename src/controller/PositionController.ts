import { Request, Response } from 'express';
import { getById } from '../repositories/UserRepository';


export const updatePosition = async (req: Request, res: Response) => {
    const { userId, business_title } = req.body;
    try {
        const user = await getById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        user.business_title = business_title ? business_title : user.business_title;
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error Updating Position:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
