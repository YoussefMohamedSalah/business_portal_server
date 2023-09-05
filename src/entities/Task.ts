import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './Company';
import { Project } from './Project';

@Entity({ name: 'task' })
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    priority: string;

    // Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.tasks, { onDelete: 'CASCADE' })
	company: Company;

	@ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
	project: Project;
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