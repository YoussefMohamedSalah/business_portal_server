import { getRepository } from "typeorm";
import { Notification } from "../entities/Notification";

// DONE
export const createNotification = async (title: string, content: string, userId: any,) => {
    const notificationRepository = getRepository(Notification);
    const notification = new Notification();
    notification.title = title;
    notification.content = content;
    notification.user = userId;
    await notificationRepository.save(notification);
    return notification;
};

