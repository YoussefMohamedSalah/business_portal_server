import { Request, Response } from 'express';
import { createCompany, getById } from '../repositories/CompanyRepository';
import bcrypt from "bcrypt";
import { Notification } from '../entities/Notification';
import { getCustomRepository } from 'typeorm';
import { NotificationRepository } from '../repositories/NotificationRepository';

export const createNotification = async (req: Request, res: Response) => {
    const { content, sender } = req.body;
    const notificationRepository = getCustomRepository(NotificationRepository);
    const notification = notificationRepository.create({ content, sender });
    await notificationRepository.save(notification);
    return res.status(201).json({ msg: "notification added" });
};

// export const listenForNotifications = async (req: Request, res: Response) => {
//     const notificationRepository = getCustomRepository(NotificationRepository);
//     await notificationRepository.listenForNotifications();
//     return res.status(200).json({ msg: "listening for notifications" });
// };