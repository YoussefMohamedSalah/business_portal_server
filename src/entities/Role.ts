import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, ManyToOne } from 'typeorm';

// Many to one with company entity
// one to many with user entity
// Many to one with department entity

// this role entity refers to the roles that are assigned to users 
// ex: HR Assistant || HR Manager...etc
// if role is assistant then he can only read and write
// or i can modify this to be a permission entity.

@Entity({ name: 'role' })
export class Role extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column()
	name: string;

	@Column()
	department: string;

	// i will connect this with user entity
	// so that i can get all roles and assign it to user

}