import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, ManyToOne } from 'typeorm';

import { Role } from '../enums/enums';
import { Owner } from './Owner';

// this is our customers
@Entity({ name: 'customer' })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    default: null,
    select: false
  })
  password: string;

  @Column({
    default: null
  })
  string_password: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Associate
  })
  role: Role;

  @ManyToOne(type => Owner, owner => owner.associates)
  owner: Owner;

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
}