import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'company' })
export class Company extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

    // company_name: string;
    // users: User[];
    // projects: Project[];
    // customers: Customer[];
    // suppliers: Supplier[];
    // inventory types: 

    @Column({
        default: null
    })
    name: string;

    @Column({
        default: null
    })
    users: string;

    @Column({
        default: null
    })
    projects: string;

    @Column({
        default: null
    })
    customers: string;

    @Column({
        default: null
    })
    suppliers: string;

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