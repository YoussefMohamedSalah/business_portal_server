import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './Company';
import { Project } from './Project';
import { Group } from './Group';

@Entity({ name: 'task' })
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	task_type: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	task_priority: string;

	@Column({ nullable: true })
	task_progress: string;

	@Column({ nullable: true })
	status: string;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'{}'",
		nullable: false,
	})
	user: { id: string, name: string };

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
	start_at: Date;

	@Column({
		type: 'date',
		default: null,
	})
	end_at: Date;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.tasks, { onDelete: 'CASCADE' })
	company: Company;

	@ManyToOne(() => Group, group => group.tasks, { onDelete: 'CASCADE' })
	group: Group;
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