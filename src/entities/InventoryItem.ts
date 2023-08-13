import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Inventory } from './Inventory';


// this will be connected with inventory entity -- yes

@Entity({ name: 'inventory_item' })
export class InventoryItem extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	count: number;

	@Column()
	thumbnail: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Inventory, inventory => inventory.inventory_items, { onDelete: 'CASCADE' })
	inventory: Inventory;
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