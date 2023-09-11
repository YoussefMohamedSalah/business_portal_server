import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { SiteRequest } from '../entities/SiteRequest';
import { handleNotification } from '../config/NotificationsCenter';

@EventSubscriber()
export class SiteSubscriber implements EntitySubscriberInterface<SiteRequest> {
    listenTo() {
        return SiteRequest;
    }

    afterInsert(event: InsertEvent<SiteRequest>) {
        handleNotification("SiteRequest", event.entity)
    }
}