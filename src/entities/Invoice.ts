import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, BeforeInsert } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';
import { Status } from '../enums/enums';
import { Subcontractor } from './Subcontractor';
import { Contract } from './Contract';

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    code: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: string;

    @Column({ nullable: true })
    total_amount: number;

    @Column({ nullable: true })
    paid_amount: number;

    @Column({ nullable: true })
    remaining_amount: number;

    @Column({ nullable: true })
    subject: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    items: Array<{ item: string, description: string, count: number, remaining_count: number, price: number, total: number, percentage: number }>;

    @Column({ nullable: true })
    vat: number;

    @Column({ nullable: true })
    contract_id: string;

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
        type: 'enum',
        default: Status.PENDING,
        enum: Status
    })
    status: string;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Project, project => project.invoices, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => Contract, company => company.invoices, { onDelete: 'CASCADE' })
    contract: Contract;

    @ManyToOne(() => Subcontractor, subcontractor => subcontractor.invoices, { onDelete: 'CASCADE' })
    subcontractor: Subcontractor;

    @ManyToOne(() => Company, company => company.invoices, { onDelete: 'CASCADE' })
    company: Company;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    // BeforeInsert decorator to generate and increment CODE
    @BeforeInsert()
    incrementTenderId() {
        this.code = `INV-${Math.floor(Math.random() * 10000) + 1}`;
    }
}