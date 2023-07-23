import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { User } from '../User';
import { Department } from '../Department';
import { DepartmentType, NyType } from '../../enums/enums';

@Entity({ name: 'user_department' })
export class UserDepartment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Department)
    department: Department;

    @Column({
        type: 'enum',
        enum: NyType,
        default: NyType.NO
    })
    can_read: string;

    @Column({
        type: 'enum',
        enum: NyType,
        default: NyType.NO
    })
    can_write: string;

    @Column({
        type: 'enum',
        enum: NyType,
        default: NyType.NO
    })
    can_update: string;

    @Column({
        type: 'enum',
        enum: NyType,
        default: NyType.NO
    })
    can_delete: string;
}