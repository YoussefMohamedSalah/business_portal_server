import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, BeforeInsert } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';
import { Subcontractor } from './Subcontractor';
import { Status } from '../enums/enums';

@Entity({ name: 'subcontractor_invoice' })
export class SubcontractorInvoice extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
        default: () => "'[]'",
        nullable: false,
    })
    conditions: string[];

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    items: Array<{ item: string, description: string, count: number, price: number, total: number }>;

    @Column({ default: 0 })
    total_value: number;

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

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: false,
    })
    subcontractor_details: { id: string, name: string };

    @Column({
        type: 'enum',
        default: Status.PENDING,
        enum: Status
    })
    status: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    work_flow: Array<{ userId: string, title: string, state: boolean, isRejected: boolean }>;

    @Column({ nullable: true, default: 0 })
    vat: number;


    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    files: string[];

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Project, project => project.subcontractorInvoices, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => Company, company => company.subcontractorInvoices, { onDelete: 'CASCADE' })
    company: Company;

    @ManyToOne(() => Subcontractor, subcontractor => subcontractor.subcontractorInvoices)
    subcontractor: Subcontractor;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    // BeforeInsert decorator to generate and increment CODE
    @BeforeInsert()
    incrementTenderId() {
        this.code = `PC-${Math.floor(Math.random() * 10000) + 1}`;
    }
}