import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
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

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @OneToMany(() => Project, project => project.company, { cascade: true, onDelete: 'CASCADE' })
    projects: Project[];

    @OneToMany(() => Department, department => department.company, { cascade: true, onDelete: 'CASCADE' })
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