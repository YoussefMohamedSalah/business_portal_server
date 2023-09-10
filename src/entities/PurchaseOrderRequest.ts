import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, BeforeInsert, Generated, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';
import { Status } from '../enums/enums';

@Entity({ name: 'purchase_order_request' })
export class PurchaseOrderRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: 'purchase_order_request'
    })
    type: string;

    @Column({ unique: true, nullable: true })
    code: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: false,
    })
    user: { id: string, name: string };

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: false,
    })
    project_details: { id: string, name: string };

    @Column({ nullable: true })
    subject: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        default: Status.PENDING,
        enum: Status
    })
    status: string;

    @Column({ nullable: true })
    vat: number;

    @Column({ nullable: true })
    total: number;

    // when creating a new request, we take the current work flow from the company table
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    work_flow: Array<{ userId: string, title: string, state: boolean, isRejected: boolean }>;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Project, project => project.PurchaseOrderRequests)
    project: Project;

    @ManyToOne(() => Company, company => company.PurchaseOrderRequests)
    company: Company;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    // BeforeInsert decorator to generate and increment CODE
    @BeforeInsert()
    incrementTenderId() {
        this.code = `PO-${Math.floor(Math.random() * 10000) + 1}`;
    }
}

