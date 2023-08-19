import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'petty_cash_request' })
export class PettyCashRequest extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
		default: 'petty_cash_request'
	})
	type: string;

	@Column({
		type: 'date',
		default: () => 'CURRENT_DATE'
	})
	date: string;

	@Column({ nullable: true })
	subject: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Project, project => project.PettyCashRequests)
	project: Project;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}