import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne } from 'typeorm';
import { Company } from './Company';

@Entity({ name: 'request_work_flow' })
export class RequestWorkFlow extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	site_request_flow: Array<{ userId: string, title: string, state: boolean }>;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	petty_cash_request_flow: Array<{ userId: string, title: string, state: boolean }>;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	material_request_flow: Array<{ userId: string, title: string, state: boolean }>;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	purchase_order_flow: Array<{ userId: string, title: string, state: boolean }>;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@OneToOne(() => Company, company => company.workFlow)
	company: Company;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}