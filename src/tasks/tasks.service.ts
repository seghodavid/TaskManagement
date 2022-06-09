import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../auth/user.entity'
import { createTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-task-filter.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'
import { TaskRepository } from './task.repository'

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(TaskRepository)
		private taskRepository: TaskRepository,
	) {}

	async getTasks(payload: GetTasksFilterDto, user: User): Promise<Task[]> {
		return this.taskRepository.getTasks(payload, user)
	}

	async getTaskById(id: string, user: User): Promise<Task> {
		const found = await this.taskRepository.findOne({ where: { id, user } })

		if (!found) {
			throw new NotFoundException(`Task with ID "${id}" not found.`)
		}
		return found
	}

	async createTask(payload: createTaskDto, user: User): Promise<Task> {
		return this.taskRepository.createTask(payload, user)
	}

	async updateTaskStatus(
		id: string,
		status: TaskStatus,
		user: User,
	): Promise<Task> {
		const task = await this.getTaskById(id, user)
		task.status = status

		await task.save()
		return task
	}

	async deleteTask(id: number, user: User): Promise<void> {
		const existingTask = await this.taskRepository.delete({ id, user })

		if (existingTask.affected === 0) {
			throw new NotFoundException(`this task of ${id} does not exist`)
		}
	}
}
