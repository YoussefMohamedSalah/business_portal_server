import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany, OneToOne } from 'typeorm';
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
	site_request_flow: Array<{ userId: string, state: boolean }>;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	petty_cash_request_flow: Array<{ userId: string, state: boolean }>;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	material_request_flow: Array<{ userId: string, state: boolean }>;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@OneToOne(() => Company, company => company.workFlow)
	company: Company;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}

/**
	site_request_flow: [
	{
		userId: '1',
		state: false
	},
	{
		userId: '2',
		state: false
	},
 */