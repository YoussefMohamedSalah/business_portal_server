import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { InventoryType } from '../enums/enums';
import { Company } from './Company';
import { InventoryItem } from './InventoryItem';

// this will be connected with company entity -- yes
// also this will be connected with project entity -- yes

@Entity({ name: 'inventory' })
export class Inventory extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({
		type: 'enum',
		default: InventoryType.Master,
		enum: InventoryType
	})
	type: InventoryType;

	@Column()
	items_count: number;

	@Column()
	items_value: number;

	@Column()
	items: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.inventory_list, { onDelete: 'CASCADE' })
	company: Company;

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