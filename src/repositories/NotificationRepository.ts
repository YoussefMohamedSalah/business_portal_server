import { getRepository } from "typeorm";
import { Notification } from "../entities/Notification";

// DONE
export const createNotification = async (
    title: string,
    content: string,
    userId: any,
) => {
    // create a notification
    const notificationRepository = getRepository(Notification);
    const notification = new Notification();
    notification.title = title;
    notification.content = content;
    notification.user = userId;
    await notificationRepository.save(notification);
    return notification;
};

// DONE
export const getById = async (id: string) => {
    const notificationRepository = getRepository(Notification);
    const notification = await notificationRepository
        .createQueryBuilder("notification")
        .where("notification.id = :id", { id: id })
        .getOne();
    return notification;
};

// DONE
export const getAllNotifications = async (userId: string) => {
    const notificationRepository = getRepository(Notification);
    const notification = await notificationRepository
        .createQueryBuilder("notification")
        .where("notification.userId = :userId", { userId: userId })
        .orderBy("notification.receivedAt", "DESC")
        .getMany();
    return notification;
};
