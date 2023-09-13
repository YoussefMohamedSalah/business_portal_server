import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { MaterialRequest } from '../entities/MaterialRequest';
import { handleRequestNotification } from '../subscribersController/RequestsSubController';

@EventSubscriber()
export class MaterialSubscriber implements EntitySubscriberInterface<MaterialRequest> {
    listenTo() {
        return MaterialRequest;
    }

    afterInsert(event: InsertEvent<MaterialRequest>) {
        handleRequestNotification("MaterialRequest", event.entity)
    }
}