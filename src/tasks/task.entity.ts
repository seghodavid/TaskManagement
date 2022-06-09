import { Exclude } from 'class-transformer'
import { User } from '../auth/user.entity'
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { TaskStatus } from './task-status.enum'

@Entity()
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column()
	description: string

	@Column()
	status: TaskStatus

	@ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
	@Exclude({ toPlainOnly: true })
	user: User
}
