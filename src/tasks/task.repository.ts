import { User } from 'src/auth/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { createTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-task-filter.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
	async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
		const { status, search } = filterDto
		const query = this.createQueryBuilder('task')
		query.where({ user })

		if (status) {
			query.andWhere('task.status = :status', { status })
		}

		if (search) {
			query.andWhere(
				'(LOWER(task.title) LIKE LOWER (:search) OR LOWER(task.description) LIKE LOWER(:search))',
				{ search: `%${search}%` },
			)
		}

		const tasks = await query.getMany()

		return tasks
	}

	async createTask(payload: createTaskDto, user: User): Promise<Task> {
		const { title, description } = payload

		const task = this.create({
			title,
			description,
			status: TaskStatus.OPEN,
			user,
		})

		await this.save(task)
		return task
	}
}
