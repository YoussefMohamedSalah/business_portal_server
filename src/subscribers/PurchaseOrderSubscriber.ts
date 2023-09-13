import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { PurchaseOrderRequest } from '../entities/PurchaseOrderRequest';
import { handleRequestNotification } from '../subscribersController/RequestsSubController';

@EventSubscriber()
export class PurchaseOrderSubscriber implements EntitySubscriberInterface<PurchaseOrderRequest> {
    listenTo() {
        return PurchaseOrderRequest;
    }

    afterInsert(event: InsertEvent<PurchaseOrderRequest>) {
        handleRequestNotification("PurchaseOrderRequest", event.entity)
    }
}