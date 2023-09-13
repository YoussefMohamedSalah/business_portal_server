import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { PettyCashRequest } from '../entities/PettyCashRequest';
import { handleRequestNotification } from '../subscribersController/RequestsSubController';

@EventSubscriber()
export class PettyCashSubscriber implements EntitySubscriberInterface<PettyCashRequest> {
    listenTo() {
        return PettyCashRequest;
    }

    afterInsert(event: InsertEvent<PettyCashRequest>) {
        handleRequestNotification("PettyCashRequest", event.entity)
    }
}