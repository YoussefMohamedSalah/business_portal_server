import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Project } from '../Project';
import { User } from '../User';

@Entity({ name: 'user_project' })
export class UserProject extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Project)
    project: Project;
}