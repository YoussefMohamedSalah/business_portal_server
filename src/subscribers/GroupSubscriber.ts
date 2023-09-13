import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Group } from '../entities/Group';

@EventSubscriber()
export class GroupSubscriber implements EntitySubscriberInterface<Group> {
	listenTo() {
		return Group;
	}

	afterInsert(event: InsertEvent<Group>) {
		console.log('Group inserted:', event.entity);
	}
}