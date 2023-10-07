import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, OneToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Company } from './Company';
import { Customer } from './Customer';
import { SiteRequest } from './SiteRequest';
import { PettyCashRequest } from './PettyCashRequest';
import { MaterialRequest } from './MaterialRequest';
import { PurchaseOrderRequest } from './PurchaseOrderRequest';
import { Group } from './Group';
import { Inventory } from './Inventory';
import { User } from './User';
import { Contract } from './Contract';
import { Invoice } from './Invoice';


@Entity({ name: 'project' })
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true, default: null })
	longitude: number;

	@Column({ nullable: true })
	latitude: number;

	@Column({ nullable: true })
	thumbnail: string;

	@Column({ nullable: true })
	bid_value: number;

	@Column({ nullable: true, default: 0 })
	duration: number; // in days

	@Column({ nullable: true, default: 'In Progress' })
	project_status: string;

	@Column({
		type: 'date',
		default: () => 'CURRENT_TIMESTAMP'
	})
	delivery_date: string;

	@Column({
		type: 'date',
		default: () => 'CURRENT_TIMESTAMP'
	})
	contract_date: string;

	@Column({ nullable: true })
	contract_number: string;

	@Column({ nullable: true, default: 0 })
	sites_count: number;

	@Column({ nullable: true, default: 0 })
	buildings_count: number;

	@Column({ nullable: true, default: 0 })
	floors_count: number;

	// -----------------------------------------------
	@Column({ default: 0, nullable: true })
	total_budget: number;

	@Column({ default: 0, nullable: true })
	po_budget: number;

	@Column({ default: 0, nullable: true })
	po_expenses: number;

	@Column({ default: 0, nullable: true })
	pc_budget: number;

	@Column({ default: 0, nullable: true })
	pc_expenses: number;

	@Column({ default: 0, nullable: true })
	staff_budget: number;

	@Column({ default: 0, nullable: true })
	staff_expenses: number;

	@Column({ default: 0, nullable: true })
	subcontractor_budget: number;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	comments: Array<{ id: number, userId: string, userName: string, comment: string, createdAt: string }>;

	@Column({ default: 0, nullable: true })
	comments_count: number;

	@Column({ default: 0, nullable: true })
	members_count: number;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.projects, { onDelete: 'CASCADE' })
	company: Company;

	@ManyToOne(() => Customer, customer => customer.projects)
	customer: Customer;

	@ManyToMany(() => User, user => user.projects)
	project_managers: User[];

	@OneToOne(() => Group, group => group.project, { onDelete: 'CASCADE' })
	@JoinColumn()
	group: Group;

	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@OneToOne(() => Inventory, inventory => inventory.project, { onDelete: 'CASCADE' })
	@JoinColumn()
	inventory: Inventory;

	@OneToMany(() => SiteRequest, SiteRequest => SiteRequest.project, { onDelete: 'CASCADE' })
	SiteRequests: SiteRequest[];

	@OneToMany(() => PettyCashRequest, PettyCashRequest => PettyCashRequest.project, { onDelete: 'CASCADE' })
	PettyCashRequests: PettyCashRequest[];

	@OneToMany(() => MaterialRequest, MaterialRequest => MaterialRequest.project, { onDelete: 'CASCADE' })
	MaterialRequests: MaterialRequest[];
	// purchase_order
	@OneToMany(() => PurchaseOrderRequest, purchaseOrderRequest => purchaseOrderRequest.project, { onDelete: 'CASCADE' })
	PurchaseOrderRequests: PurchaseOrderRequest[];

	@OneToMany(() => Contract, Contract => Contract.project, { onDelete: 'CASCADE' })
	Contracts: Contract[];

	@OneToMany(() => Invoice, invoice => invoice.project, { onDelete: 'CASCADE' })
	invoices: Invoice[];
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