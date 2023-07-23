import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { DepartmentType } from '../enums/enums';
import { Company } from './Company';
import { User } from './User';

@Entity({ name: 'department' })
export class Department extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: DepartmentType,
        default: DepartmentType.Construction
    })
    department: string;

    // Relations
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    @ManyToOne(() => Company, company => company.departments, { onDelete: 'CASCADE' })
    company: Company;

    @ManyToMany(() => User, user => user.departments)
    users: User[];
    // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}