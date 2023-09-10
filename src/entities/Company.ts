import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Project } from './Project';
import { Customer } from './Customer';
import { Supplier } from './Supplier';
import { Inventory } from './Inventory';
import { Department } from './Department';
import { Attendance } from './Attendance';
import { RequestWorkFlow } from './RequestWorkFlow';
import { SiteRequest } from './SiteRequest';
import { PettyCashRequest } from './PettyCashRequest';
import { MaterialRequest } from './MaterialRequest';
import { PurchaseOrderRequest } from './PurchaseOrderRequest';
import { Task } from './Task';
import { Tender } from './Tender';

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

    @Column({
        default: 0,
        nullable: true
    })
    employee_count: number;

    @Column({
        default: 0,
        nullable: true
    })
    men_count: number;
    @Column({
        default: 0,
        nullable: true
    })
    women_count: number;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @OneToMany(() => Project, project => project.company, { cascade: true, onDelete: 'CASCADE' })
    projects: Project[];

    @OneToMany(() => Task, task => task.company, { cascade: true, onDelete: 'CASCADE' })
    tasks: Task[];

    @ManyToMany(() => Department, department => department.company, { cascade: true, onDelete: 'CASCADE' })
    departments: Department[];

    @OneToMany(() => User, user => user.company, { cascade: true, onDelete: 'CASCADE' })
    users: User[];

    @OneToMany(() => Customer, customer => customer.company, { cascade: true, onDelete: 'CASCADE' })
    customers: Customer[];

    @OneToMany(() => Tender, tender => tender.company, { cascade: true, onDelete: 'CASCADE' })
    tenders: Tender[];

    @OneToMany(() => Supplier, supplier => supplier.company, { cascade: true, onDelete: 'CASCADE' })
    suppliers: Supplier[];

    @OneToMany(() => Attendance, attendance => attendance.company, { cascade: true, onDelete: 'CASCADE' })
    attendances: Attendance[];

    @OneToMany(() => Inventory, inventory => inventory.company, { cascade: true, onDelete: 'CASCADE' })
    inventory_list: Inventory[];

    // Requests
    @OneToMany(() => SiteRequest, SiteRequest => SiteRequest.company)
    SiteRequests: SiteRequest[];

    @OneToMany(() => PettyCashRequest, PettyCashRequest => PettyCashRequest.company)
    PettyCashRequests: PettyCashRequest[];

    @OneToMany(() => MaterialRequest, MaterialRequest => MaterialRequest.company)
    MaterialRequests: MaterialRequest[];

    @OneToMany(() => PurchaseOrderRequest, purchaseOrderRequest => purchaseOrderRequest.company)
    PurchaseOrderRequests: PurchaseOrderRequest[];
    // -----------------------------------------------

    @OneToOne(() => RequestWorkFlow, RequestWorkFlow => RequestWorkFlow.company, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    workFlow: RequestWorkFlow;


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