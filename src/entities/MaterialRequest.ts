import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany, BeforeInsert } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';

@Entity({ name: 'material_request' })
export class MaterialRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: 'material_request'
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
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: false,
    })
    project_details: { id: string, name: string };

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
    @ManyToOne(() => Project, project => project.MaterialRequests)
    project: Project;

    @ManyToOne(() => Company, company => company.MaterialRequests)
    company: Company;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @BeforeInsert()
    generateCode() {
        // Generate a unique incremental code
        this.code = `ma-${this.id}`;
    }
}