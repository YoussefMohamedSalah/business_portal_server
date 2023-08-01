import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
} from "typeorm";
@Entity({ name: "notification" })
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        default: ''
    })
    sender: string;

    @Column({
        default: ''
    })
    content: string;
    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    receivedAt: Date;
}
