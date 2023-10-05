import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';
import { Subcontractor } from './Subcontractor';
import { Status } from '../enums/enums';
import { Invoice } from './Invoice';

@Entity({ name: 'contract' })
export class Contract extends BaseEntity {
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

    @Column({ nullable: true })
    total_amount: number;

    @Column({ nullable: true })
    paid_amount: number;

    @Column({ nullable: true })
    remaining_amount: number;

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

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    comments: Array<{ id: number, userId: string, userName: string, comment: string, createdAt: string }>;

    @Column({ default: 0 })
    comments_count: number;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Project, project => project.Contracts, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => Company, company => company.Contracts, { onDelete: 'CASCADE' })
    company: Company;

    @ManyToOne(() => Subcontractor, subcontractor => subcontractor.Contracts, { onDelete: 'CASCADE' })
    subcontractor: Subcontractor;

    @OneToMany(() => Invoice, invoice => invoice.contract, { onDelete: 'CASCADE' })
    invoices: Invoice[];
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    // BeforeInsert decorator to generate and increment CODE
    @BeforeInsert()
    incrementTenderId() {
        this.code = `CON-${Math.floor(Math.random() * 10000) + 1}`;
    }
}