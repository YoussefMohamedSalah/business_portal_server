import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { User } from "./User";


@Entity({ name: "notification" })
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true, default: '' })
    title: string;

    @Column({ nullable: true, default: '' })
    content: string;

    @ManyToOne(() => User, user => user.notifications)
    user: User;

    @Column({ nullable: true, default: false })
    is_read: boolean;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    receivedAt: Date;
}
