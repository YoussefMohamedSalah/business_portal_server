import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Project } from './Project';
import { Customer } from './Customer';
import { Supplier } from './Supplier';
import { Inventory } from './Inventory';
import { Department } from './Department';

@Entity({ name: 'company' })
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        default: null
    })
    name: string;

    @Column({
        default: null
    })
    address: string;

    @Column({
        default: null
    })
    size: string;

    @Column({
        default: null
    })
    logo: string;

    @Column({
        default: false
    })
    is_verified: boolean;

    @Column({
		default: false
	})
	stepper_state: boolean;

	@Column({
		default: 0
	})
	stepper_step: number;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @OneToMany(() => Project, project => project.company, { cascade: true, onDelete: 'CASCADE' })
    projects: Project[];

    @ManyToMany(() => Department, department => department.company, { cascade: true, onDelete: 'CASCADE' })
    departments: Department[];

    @OneToMany(() => User, user => user.company, { cascade: true, onDelete: 'CASCADE' })
    users: User[];

    @OneToMany(() => Customer, customer => customer.company, { cascade: true, onDelete: 'CASCADE' })
    customers: Customer[];

    @OneToMany(() => Supplier, supplier => supplier.company, { cascade: true, onDelete: 'CASCADE' })
    suppliers: Supplier[];

    @OneToMany(() => Inventory, inventory => inventory.company, { cascade: true, onDelete: 'CASCADE' })
    inventory_list: Inventory[];
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