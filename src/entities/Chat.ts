import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, Column, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { ChatMessage } from './ChatMessage';
import { Group } from './Group';

@Entity({ name: 'chat' })
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @OneToMany(() => ChatMessage, chatMessage => chatMessage.chat, { onDelete: 'CASCADE' })
  messages: ChatMessage[];

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  between: Array<{ id: string, name: string, avatar: string }>;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  last_message: { content: string, status: boolean };

  // Relations
  // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
  @ManyToMany(() => User, user => user.chats)
  @JoinTable()
  users: User[];

  @OneToOne(() => Group, group => group.chat, { onDelete: 'CASCADE' })
  @JoinColumn()
  group: Group;
  // -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
};