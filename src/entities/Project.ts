import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Role } from '../enums/enums';

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
	delivery_date: Date;

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

	@Column()
	customer_name: string;

	// todo: add customer entity
	@Column()
	customer: string;

	@Column()
	sites_count: string;

	@Column()
	buildings_count: string;

	@Column()
	floors_count: string;

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