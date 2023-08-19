import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { User } from './User';
import { SiteRequest } from './SiteRequest';
import { PettyCashRequest } from './PettyCashRequest';
import { MaterialRequest } from './MaterialRequest';
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
	@OneToMany(() => SiteRequest, SiteRequest => SiteRequest.project)
	SiteRequests: SiteRequest[];

	@OneToMany(() => PettyCashRequest, PettyCashRequest => PettyCashRequest.project)
	PettyCashRequests: PettyCashRequest[];

	@OneToMany(() => MaterialRequest, MaterialRequest => MaterialRequest.project)
	MaterialRequests: MaterialRequest[];
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