import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { User } from './User';
import { SiteRequest } from './SiteRequest';
import { PettyCashRequest } from './PettyCashRequest';
import { MaterialRequest } from './MaterialRequest';
import { PurchaseOrderRequest } from './PurchaseOrderRequest';
@Entity({ name: 'project' })
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	latitude: string;

	@Column({ nullable: true })
	log: string;

	@Column({ nullable: true })
	bid_value: string;

	@Column()
	duration: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	delivery_date: string;

	@Column({ nullable: true })
	contract_number: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	contract_date: string;

	// -----------------------------------------------
	@Column({ default: null, nullable: true })
	total_budget: string;

	@Column({ default: null, nullable: true })
	po_budget: string;

	@Column({ default: null, nullable: true })
	po_expenses: string;

	@Column({ default: null, nullable: true })
	pc_budget: string;

	@Column({ default: null, nullable: true })
	pc_expenses: string;

	@Column({ default: null, nullable: true })
	subcontractor_budget: string;

	@Column({ default: null, nullable: true })
	staff_Budget: string;
	// -----------------------------------------------

	@Column({ nullable: true })
	project_manager: string;

	@Column({ nullable: true })
	sites_count: string;

	@Column({ nullable: true })
	buildings_count: string;

	@Column({ nullable: true })
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
	// purchase_order
	@OneToMany(() => PurchaseOrderRequest, purchaseOrderRequest => purchaseOrderRequest.project)
	PurchaseOrderRequests: PurchaseOrderRequest[];
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