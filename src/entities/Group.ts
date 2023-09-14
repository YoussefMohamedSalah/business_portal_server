import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Project } from './Project';
import { Task } from './Task';
import { User } from './User';

@Entity({ name: 'group' })
export class Group extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	managers: User[];

	@Column({ default: 0 })
	members_count: number;

	@Column({ default: 0 })
	tasks_count: number;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.groups, { onDelete: 'CASCADE' })
	company: Company;

	@OneToOne(() => Project, project => project.group, { onDelete: 'CASCADE' })
	@JoinColumn()
	project: Project;

	@OneToMany(() => Task, task => task.group, { onDelete: 'CASCADE' })
	tasks: Task[];

	@ManyToMany(() => User, user => user.groups)
	members: User[];
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