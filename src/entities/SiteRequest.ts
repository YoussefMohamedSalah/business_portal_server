import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'site_request' })
export class SiteRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: 'site_request'
    })
    type: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: string;

    @Column({ nullable: true })
    subject: string;

    @Column({
        nullable: false,
        default: ''
    })
    content: string;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Project, project => project.SiteRequests)
    project: Project;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}