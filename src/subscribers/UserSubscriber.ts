import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm';
import { User } from '../entities/User';
import { HandleEmployeesCount } from '../subscribersController/UserSubController';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    afterInsert(event: InsertEvent<User>) {
        HandleEmployeesCount('add', event.entity)
    }

    afterRemove(event: RemoveEvent<User>): void | Promise<any> {
        if (event.entity) HandleEmployeesCount('remove', event.entity)
    }
}