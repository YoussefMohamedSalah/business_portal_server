import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Company } from './Company';
import { User } from './User';

@Entity({ name: 'attendance' })
export class Attendance extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({
		type: 'date',
		default: () => 'CURRENT_DATE'
	})
	date: string;

	@Column({ nullable: true })
	late: boolean;

	@Column({
		type: 'time',
		nullable: true
	})
	late_by: string;

	@Column({ nullable: true })
	early: boolean;

	@Column({
		type: 'time',
		nullable: true
	})
	early_by: string;

	@Column({ nullable: true, default: true })
	absent: boolean;

	@Column({
		type: 'time',
		nullable: true
	})
	enter_time: string;

	@Column({
		type: 'time',
		nullable: true
	})
	leave_time: string;

	@Column({
		type: 'time',
		nullable: true
	})
	working_hours: string;

	@Column({
		type: 'time',
		nullable: true
	})
	over_time: string;

	@Column({
		type: 'time',
		nullable: true
	})
	shift_start: string;

	@Column({
		type: 'time',
		nullable: true
	})
	shift_end: string;

	// Add HR report for reason why late
	@Column({ nullable: true })
	late_reason: string;

	// Add Daily report with ending working hours
	@Column({ nullable: true })
	daily_report: string;

	// Relations
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
	@ManyToOne(() => Company, company => company.attendances, { onDelete: 'CASCADE' })
	company: Company;

	@ManyToOne(() => User, user => user.attendances, { onDelete: 'CASCADE' })
	user: User;
	// -----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
}