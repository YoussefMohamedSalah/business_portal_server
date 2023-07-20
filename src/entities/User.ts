import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Role } from '../enums/enums';
import { Customer } from './Customer';

@Entity({ name: 'user' })
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		default: null
	})
	first_name: string;

	@Column({
		default: null
	})
	last_name: string;

	@Column({
		default: null
	})
	user_name: string;

	@Column({
		default: null
	})
	email: string;

	@Column({
		default: null
	})
	address: string;

	@Column({
		default: null
	})
	phone_number: string;

	@Column({
		default: null
	})
	working_hours: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	contract_date: Date;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	contract_ex: Date;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	renewal_of_residence: Date;

	@Column()
	project: string;

	@Column()
	id_number: string;

	@Column()
	id_ex_date: string;

	@Column()
	salary_per_month: string;

	@Column({
		default: null
	})
	salary_per_hour: string;

	@Column({
		default: null
	})
	password: string;

	@Column({
		type: 'enum',
		enum: Role,
		default: Role.Owner
	})
	role: Role;

	@Column({
		default: null
	})
	sign: string;

	@Column({
		default: null
	})
	picture: string;

	@Column({
		default: null
	})
	file: string;

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