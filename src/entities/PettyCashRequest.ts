import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';

@Entity({ name: 'petty_cash_request' })
export class PettyCashRequest extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
		default: 'petty_cash_request'
	})
	type: string;

	@Column({ nullable: true })
	code: string;

	@Column({
		type: 'date',
		default: () => 'CURRENT_DATE'
	})
	date: string;

	@Column({
		type: 'date',
		default: () => 'CURRENT_DATE'
	})
	transaction_date: string;

	@Column({ nullable: true })
	paid_amount: number;

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
		default: () => "'{}'",
		nullable: false,
	})
	project_details: { id: string, name: string };

	@Column({ nullable: true })
	balance_payment: number;

	@Column({ nullable: true })
	subject: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	status: string; // accepted, rejected, pending

	@Column({ nullable: true })
	vat: number;

	@Column({ nullable: true })
	total: number;

	// when creating a new request, we take the current work flow from the company table
	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	work_flow: Array<{ userId: string, state: boolean }>;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Project, project => project.PettyCashRequests)
	project: Project;

	@ManyToOne(() => Company, company => company.PettyCashRequests)
	company: Company;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}