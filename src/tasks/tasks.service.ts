import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
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

	async getTasks(payload: GetTasksFilterDto): Promise<Task[]> {
		return this.taskRepository.getTasks(payload)
	}

	async getTaskById(id: number): Promise<Task> {
		const found = await this.taskRepository.findOne({ where: { id: id } })

		if (!found) {
			throw new NotFoundException(`Task with ID "${id}" not found.`)
		}
		return found
	}

	async createTask(payload: createTaskDto, user: User): Promise<Task> {
		return this.taskRepository.createTask(payload, user)
	}

	async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
		const task = await this.getTaskById(id)
		task.status = status

		await task.save()
		return task
	}

	async deleteTask(id: number): Promise<void> {
		const existingTask = await this.getTaskById(id)

		await this.taskRepository.delete(existingTask)
	}
}
