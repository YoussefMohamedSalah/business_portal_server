import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { ChatMessage } from './ChatMessage';

@Entity({ name: 'chat' })
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, user => user.chats)
  @JoinTable()
  users: User[];

  @OneToMany(() => ChatMessage, chatMessage => chatMessage.chat)
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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
};