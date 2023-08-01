import { EntityRepository, Repository, getConnection, getCustomRepository } from "typeorm";
import { Notification } from "../entities/Notification";


@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {

    // async listenForNotifications() {
    //     const notificationRepository = getCustomRepository(NotificationRepository);
    //     const queryBuilder = notificationRepository.createQueryBuilder('notification');
    //     const queryRunner = notificationRepository.manager.queryRunner;
    //     if (!queryRunner) return
    //     await queryRunner.connect();
    //     await queryRunner.query('LISTEN my_channel');
    //     queryRunner.connection.on('notification', async (msg: any) => {
    //         console.log('Received notification:', msg.content);
    //         const notification = new Notification();
    //         notification.content = msg.content;
    //         notification.receivedAt = new Date();
    //         await notificationRepository.save(notification);
    //     });
    // }
}