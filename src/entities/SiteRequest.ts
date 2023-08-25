import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, BeforeInsert, JoinTable, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';

@Entity({ name: 'site_request' })
export class SiteRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: 'site_request'
    })
    type: string;

    @PrimaryGeneratedColumn('increment')
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

    @Column({ nullable: true })
    status: string; // accepted, rejected, pending

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
    @ManyToOne(() => Project, project => project.SiteRequests)
    project: Project;

    @ManyToOne(() => Company, company => company.SiteRequests)
    company: Company;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}