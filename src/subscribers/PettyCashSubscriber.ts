import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { PettyCashRequest } from '../entities/PettyCashRequest';
import { handleNotification } from '../config/NotificationsCenter';

@EventSubscriber()
export class PettyCashSubscriber implements EntitySubscriberInterface<PettyCashRequest> {
    listenTo() {
        return PettyCashRequest;
    }

    afterInsert(event: InsertEvent<PettyCashRequest>) {
        handleNotification("PettyCashRequest", event.entity)
    }
}