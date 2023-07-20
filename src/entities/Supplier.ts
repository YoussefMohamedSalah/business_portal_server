import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { SupplierType } from '../enums/enums';

@Entity({ name: 'supplier' })
export class Supplier extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: SupplierType,
		default: SupplierType.Company
	})
	supplier_type: SupplierType;

	@Column({
		default: null
	})
	company_name: string;

	@Column({
		default: null
	})
	vat_on: string;

	@Column({
		default: null
	})
	Representative: string;

	@Column({
		default: null
	})
	name: string;

	@Column({
		default: null
	})
	phone_number: string;

	@Column({
		default: null
	})
	email: string;

	@Column({
		default: null
	})
	country: string;

	@Column({
		default: null
	})
	city: string;

	@Column({
		default: null
	})
	area: string;

	@Column({
		default: null
	})
	street: string;

	@Column({
		default: null
	})
	building_number: number;

	@Column({
		default: null
	})
	postal_code: number;

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