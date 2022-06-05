import { User } from 'src/auth/user.entity'
import { EntityRepository, Repository } from 'typeorm'
import { createTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-task-filter.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
	async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
		const { status, search } = filterDto
		const query = this.createQueryBuilder('task')

		if (status) {
			query.andWhere('task.status = :status', { status })
		}

		if (search) {
			query.andWhere(
				'task.title LIKE :search OR task.description LIKE :search',
				{ search: `%${search}%` },
			)
		}

		const tasks = await query.getMany()

		return tasks
	}

	async createTask(payload: createTaskDto, user: User): Promise<Task> {
		const { title, description } = payload
		const task = new Task()
		title
		description
		task.status = TaskStatus.OPEN
		user
		await task.save()
		return task
	}
}
