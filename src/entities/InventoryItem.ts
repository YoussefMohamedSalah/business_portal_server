import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';


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