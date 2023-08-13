import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { SupplierType } from '../enums/enums';
import { Company } from './Company';

@Entity({ name: 'supplier' })
export class Supplier extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: SupplierType,
		default: SupplierType.Company
	})
	supplier_type: string;

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
	building_number: string;

	@Column({
		default: null
	})
	postal_code: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.suppliers, { onDelete: 'CASCADE' })
	company: Company;
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