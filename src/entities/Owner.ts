import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Role } from '../enums/enums';
import { Customer } from './Customer';

// this is our owners under the name of owners
@Entity({ name: 'owner' })
export class Owner extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

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

	@Column()
	phone: string;

	@OneToMany(type => Customer, customer => customer.owner)
	associates: Customer[];

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