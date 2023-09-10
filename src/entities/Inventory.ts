import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { InventoryType } from '../enums/enums';
import { Company } from './Company';
import { InventoryItem } from './InventoryItem';
import { Project } from './Project';

// this will be connected with company entity -- yes
// also this will be connected with project entity -- yes

@Entity({ name: 'inventory' })
export class Inventory extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({
		type: 'enum',
		default: InventoryType.MASTER,
		enum: InventoryType
	})
	type: string;

	@Column({
		default: 0
	})
	items_count: number;

	@Column({
		default: 0
	})
	items_value: number;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.inventory_list, { onDelete: 'CASCADE' })
	company: Company;

	@OneToOne(() => Project, project => project.inventory, { cascade: true, onDelete: 'CASCADE' })
    project: Project;

	@OneToMany(() => InventoryItem, inventoryItem => inventoryItem.inventory, { cascade: true, onDelete: 'CASCADE' })
	inventory_items: InventoryItem[];
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