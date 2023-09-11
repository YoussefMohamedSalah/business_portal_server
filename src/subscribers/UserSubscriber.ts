import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/User';
import { createNotification } from '../repositories/NotificationRepository';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    afterInsert(event: InsertEvent<User>) {
        console.log('User inserted:', event.entity);
        createNotification("Welcome to the app", "Welcome to the app", event.entity);
        
    }
}