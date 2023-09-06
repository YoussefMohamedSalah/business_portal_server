import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Company } from './Company';
import { Project } from './Project';
import { Task } from './Task';

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
		default: () => "'{}'",
		nullable: false,
	})
	manager: { id: string, name: string };

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    members: Array<{ id: string, name: string }>;

    @Column({default: 0})
    members_count: number;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@OneToOne(() => Project, project => project.group, { onDelete: 'CASCADE' })
	project: Project;

    @OneToMany(() => Task, task => task.group, { onDelete: 'CASCADE' })
    tasks: Task[];
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