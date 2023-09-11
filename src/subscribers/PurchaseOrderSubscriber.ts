import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { PurchaseOrderRequest } from '../entities/PurchaseOrderRequest';
import { handleNotification } from '../config/NotificationsCenter';

@EventSubscriber()
export class PurchaseOrderSubscriber implements EntitySubscriberInterface<PurchaseOrderRequest> {
    listenTo() {
        return PurchaseOrderRequest;
    }

    afterInsert(event: InsertEvent<PurchaseOrderRequest>) {
        handleNotification("PurchaseOrderRequest", event.entity)
    }
}