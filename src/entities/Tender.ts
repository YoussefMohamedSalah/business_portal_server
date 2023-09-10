import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, BeforeInsert } from 'typeorm';
import { Status } from '../enums/enums';
import { Company } from './Company';

// this will be connected with company entity -- yes

@Entity({ name: 'tender' })
export class Tender extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    tender_id: string;

    @Column({
        type: 'enum',
        default: Status.PENDING,
        enum: Status
    })
    status: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: false,
    })
    user: { id: string, name: string };

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    date: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    hand_over: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    files: File[];

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    comments: Array<{ id: number, userId: string, name: string, comment: string }>;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Company, company => company.tenders, { onDelete: 'CASCADE' })
    company: Company;
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

    // BeforeInsert decorator to generate and increment user_id
    @BeforeInsert()
    incrementTenderId() {
        this.tender_id = `T-${Math.floor(Math.random() * 10000) + 1}`;
    }
}