import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Project } from '../entities/Project';

@EventSubscriber()
export class ProjectSubscriber implements EntitySubscriberInterface<Project> {
	listenTo() {
		return Project;
	}

	afterInsert(event: InsertEvent<Project>) {
		console.log('Project inserted:', event.entity);
	}
}