import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Company } from './Company';
import { User } from './User';
import { Permission } from './Permission';

@Entity({ name: 'department' })
export class Department extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
		default: ''
	})
	name: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToMany(() => Company, company => company.departments, { onDelete: 'CASCADE' })
	@JoinTable({ name: 'company_department' })
	company: Company;

	@ManyToMany(() => User, user => user.departments)
	@JoinTable({ name: 'user_department' })
	users: User[];

	@OneToMany(() => Permission, permission => permission.department)
	permissions: Permission[];
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}