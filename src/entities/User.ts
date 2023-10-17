import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	BaseEntity,
	ManyToOne,
	OneToMany,
	BeforeInsert,
	ManyToMany,
	JoinTable
} from "typeorm";
import { Company } from "./Company";
import { Department } from "./Department";
import { Attendance } from "./Attendance";
import { Notification } from "./Notification";
import { Task } from "./Task";
import { Group } from "./Group";
import { Project } from "./Project";
import { Role } from '../enums/enums';
import { Chat } from "./Chat";


@Entity({ name: "user" })
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true, nullable: true })
	user_id: string;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'{}'",
		nullable: false
	})
	company_info: { id: string, name: string };

	// GENERAL INFO *************************************
	@Column({
		default: null
	})
	first_name: string;

	@Column({
		default: null
	})
	last_name: string;

	@Column({
		default: null
	})
	email: string;

	@Column({
		default: null
	})
	password: string;

	@Column({
		default: 'uploads/placeholders/person.jpg',
		nullable: true
	})
	avatar: string;

	@Column({
		default: null
	})
	gender: string;

	@Column({
		default: null
	})
	address: string;

	@Column({
		default: null
	})
	phone_number: string;

	@Column({
		type: "date",
		default: () => "CURRENT_TIMESTAMP"
	})
	renewal_of_residence: string;

	@Column({
		nullable: true
	})
	id_number: string;

	@Column({
		nullable: true
	})
	id_ex_date: string;

	// BUSINESS INFO *************************************
	@Column({
		default: null
	})
	business_title: string;

	@Column({
		type: 'enum',
		default: Role.USER,
		enum: Role
	})
	role: string;  // enum           <Superuser, "User", "Manager", "Director">

	// @Column({
	// 	default: false
	// })
	// is_manager: boolean; // useless

	// @Column({
	// 	type: 'json',
	// 	nullable: true
	// })
	// permissions: string[]; // useless

	// to be added     <KPI>

	@Column({
		default: 0
	})
	kpi: number;

	@Column({
		default: null
	})
	working_hours: string;

	@Column({
		type: "date",
		default: () => "CURRENT_TIMESTAMP"
	})
	contract_date: string;

	@Column({
		type: "date",
		default: () => "CURRENT_TIMESTAMP"
	})
	contract_ex: string;

	@Column({
		nullable: true
	})
	salary_per_month: string;

	@Column({
		default: null
	})
	salary_per_hour: string;

	@Column({
		default: null
	})
	sign: string;

	@Column({
		type: 'time',
		nullable: true,
		default: null
	})
	shift_start: string;

	@Column({
		type: 'time',
		nullable: true,
		default: null
	})
	shift_end: string;

	@Column({
		default: null
	})
	file: string;

	@Column({
		default: false
	})
	is_verified: boolean;

	@Column({
		nullable: true
	})
	temp_otp: number;

	@ManyToMany(() => Chat, chat => chat.users)
	chats: Chat[];

	// UTILS INFO *************************************
	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'{}'",
		nullable: false,
	})
	department_info: { id: string, name: string };

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	projects_info: Array<{ id: string, name: string, longitude: number, latitude: number }>;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.users, { onDelete: "CASCADE" })
	company: Company;

	@ManyToOne(() => Department, department => department.users, { onDelete: 'CASCADE' })
	department: Department;

	@OneToMany(() => Attendance, attendance => attendance.user, { onDelete: "CASCADE" })
	attendances: Attendance[];

	@OneToMany(() => Notification, notification => notification.user, { onDelete: "CASCADE" })
	notifications: Notification[];

	@ManyToMany(() => Task, task => task.users)
	tasks: Task[];

	@ManyToMany(() => Project, project => project.project_managers)
	@JoinTable({ name: 'project_manager' })
	projects: Project[];

	@ManyToMany(() => Group, group => group.members)
	@JoinTable({ name: 'group_member' })
	groups: Group[];
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP"
	})
	createdAt: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP"
	})
	updatedAt: Date;

	// BeforeInsert decorator to generate and increment user_id
	@BeforeInsert()
	incrementUserId() {
		this.user_id = `E-${Math.floor(Math.random() * 10000) + 1}`;
	}
}
