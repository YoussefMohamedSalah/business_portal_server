import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './Company';
import { Group } from './Group';
import { User } from './User';
import { TaskProgressType, taskType } from '../enums/enums';

@Entity({ name: 'task' })
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		default: taskType.GENERAL_TASK,
		enum: taskType
	})
	task_type: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	task_priority: string;

	@Column({ nullable: true })
	status: string;

	@Column({
		type: 'enum',
		default: TaskProgressType.ToDo,
		enum: TaskProgressType
	})
	task_progress: string;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'{}'",
		nullable: false,
	})
	creator: { id: string, name: string };

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	files: File[];

	@Column({
		type: 'date',
		default: () => 'CURRENT_TIMESTAMP'
	})
	start_at: string;

	@Column({
		type: 'date',
		default: null,
	})
	end_at: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.tasks, { onDelete: 'CASCADE' })
	company: Company;

	@ManyToOne(() => Group, group => group.tasks, { onDelete: 'CASCADE' })
	group: Group;

	@ManyToMany(() => User, user => user.tasks)
	@JoinTable({ name: 'user_task' })
	users: User[];
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createdAt: Date;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	updatedAt: Date;
}