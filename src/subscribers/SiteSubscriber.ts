import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { SiteRequest } from '../entities/SiteRequest';
import { handleRequestNotification } from '../subscribersController/RequestsSubController';

@EventSubscriber()
export class SiteSubscriber implements EntitySubscriberInterface<SiteRequest> {
    listenTo() {
        return SiteRequest;
    }

    afterInsert(event: InsertEvent<SiteRequest>) {
        handleRequestNotification("SiteRequest", event.entity)
    }
}