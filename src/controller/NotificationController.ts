import { Request, Response } from 'express';
import { getAllNotifications, getById } from '../repositories/NotificationRepository';

export const getNotifications = async (req: Request, res: Response) => {
    const { userId } = req.userData!;
    const userNotifications = await getAllNotifications(userId);
    if (userNotifications) {
        return res.status(200).json(userNotifications);
    }
    return res.status(200).json([]);
};

export const getNotificationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const notification = await getById(id);
    if (!notification) return res.status(404).json({ msg: "Notification not found" });
    notification.is_read = true;
    await notification.save();
    return res.status(200).json(notification);
};

export const deleteNotification = async (req: Request, res: Response) => {
    const { id } = req.params;
    const notification = await getById(id);
    if (!notification) {
        return res.status(404).json({ msg: "Notification not found" });
    }
    await notification.remove();
    return res.status(200).json({ msg: "Notification deleted successfully" });
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
    const { userId } = req.userData!;
    const userNotifications = await getAllNotifications(userId);
    if (userNotifications.length === 0) {
        return res.status(404).json({ msg: "Notifications not found" });
    }
    userNotifications.forEach(async (notification) => {
        await notification.remove();
    });
    return res.status(200).json({ msg: "Notifications deleted successfully" });
}

export const markNotificationAsRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    const notification = await getById(id);
    if (!notification) return res.status(404).json({ msg: "Notification not found" });
    notification.is_read = true;
    await notification.save();
    return res.status(200).json(notification);
}

