import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Department } from './Department';

@Entity({ name: 'permission' })
export class Permission extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false
	})
	type: string; // can_read, can_write, can_update, can_delete

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Department, department => department.permissions, { onDelete: 'CASCADE' })
	department: Department;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}