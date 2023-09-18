import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, BeforeInsert, JoinTable, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';
import { Status } from '../enums/enums';

@Entity({ name: 'site_request' })
export class SiteRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: 'site_request'
    })
    type: string;

    @Column({ unique: true, nullable: true })
    code: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: false,
    })
    user: { id: string, name: string };

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    subject: string;

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
    items: Array<{ description: string, name: string, quantity: number }>;

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
    @ManyToOne(() => Project, project => project.SiteRequests, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => Company, company => company.SiteRequests, { onDelete: 'CASCADE' })
    company: Company;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    // BeforeInsert decorator to generate and increment CODE
@BeforeInsert()
incrementTenderId() {
    this.code = `SI-${Math.floor(Math.random() * 10000) + 1}`;
}
}