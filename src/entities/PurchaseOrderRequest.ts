import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Company } from './Company';

@Entity({ name: 'purchase_order_request' })
export class PurchaseOrderRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: 'purchase_order_request'
    })
    type: string;

    @Column({ nullable: true })
    code: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date: string;

    @Column({ nullable: true })
    subject: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    status: string; // accepted, rejected, pending

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
	work_flow: Array<{ userId: string, userName: string, title: string, state: boolean }>;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Project, project => project.PurchaseOrderRequests)
    project: Project;

    @ManyToOne(() => Company, company => company.PurchaseOrderRequests)
    company: Company;
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}