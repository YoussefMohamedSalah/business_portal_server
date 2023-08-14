import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { User } from './User';
@Entity({ name: 'project' })
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	latitude: string;

	@Column()
	log: string;

	@Column()
	bid_value: string;

	@Column()
	duration: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	delivery_date: string;

	@Column()
	contract_number: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	contract_date: string;

	@Column()
	po_budget: string;

	@Column()
	pc_budget: string;

	@Column()
	subcontractor_budget: string;

	@Column()
	staff_Budget: string;

	@Column()
	total_budget: string;

	@Column()
	project_manager: string;

	// // to be deleted
	// @Column()
	// customer_name: string;

	@Column()
	sites_count: string;

	@Column()
	buildings_count: string;

	@Column()
	floors_count: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.projects, { onDelete: 'CASCADE' })
	company: Company;

	@ManyToOne(() => Customer, customer => customer.projects, { onDelete: 'CASCADE' })
	customer: Customer;

	@ManyToMany(() => User, user => user.projects)
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