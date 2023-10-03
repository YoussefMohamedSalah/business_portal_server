import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Inventory } from './Inventory';

@Entity({ name: 'inventory_item' })
export class InventoryItem extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column({
		default: 0
	})
	total_value: number;

	@Column()
	count: number;

	@Column({
		nullable: true
	})
	thumbnail: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Inventory, inventory => inventory.items, { onDelete: 'CASCADE' })
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