import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany, BeforeInsert, Generated } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';
import { Status } from '../enums/enums';

@Entity({ name: 'petty_cash_request' })
export class PettyCashRequest extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
		default: 'petty_cash_request'
	})
	type: string;

	@Column({ unique: true, nullable: true })
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

    @Column({
        type: 'enum',
        default: Status.PENDING,
        enum: Status
    })
    status: string;

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
	work_flow: Array<{ userId: string, title: string, state: boolean, isRejected: boolean }>;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Project, project => project.PettyCashRequests)
	project: Project;

	@ManyToOne(() => Company, company => company.PettyCashRequests)
	company: Company;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	// BeforeInsert decorator to generate and increment CODE
	@BeforeInsert()
	incrementTenderId() {
		this.code = `PC-${Math.floor(Math.random() * 10000) + 1}`;
	}
}