import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Chat } from './Chat';

@Entity({ name: 'chat_message' })
export class ChatMessage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: null
    })
    content: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    chat: Chat;

    @Column()
    senderId: string;

    @Column({
        nullable: true
    })
    recipientId: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;
}