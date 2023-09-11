import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { MaterialRequest } from '../entities/MaterialRequest';
import { handleNotification } from '../config/NotificationsCenter';

@EventSubscriber()
export class MaterialSubscriber implements EntitySubscriberInterface<MaterialRequest> {
    listenTo() {
        return MaterialRequest;
    }

    afterInsert(event: InsertEvent<MaterialRequest>) {
        handleNotification("MaterialRequest", event.entity)
    }
}