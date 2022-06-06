import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/auth/user.entity'
import { createTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-task-filter.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'
import { TasksService } from './tasks.service'
import { Logger } from '@nestjs/common'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	private logger = new Logger('TasksController')
	constructor(private tasksService: TasksService) {}

	@Get()
	getTasks(
		@Query(ValidationPipe) filterDto: GetTasksFilterDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		this.logger.verbose(`User "${user.username}" is retrieving all tasks. filter ${JSON.stringify(filterDto)}`)
		return this.tasksService.getTasks(filterDto, user)
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
		return this.tasksService.getTaskById(id, user)
	}

	@Post()
	// @UsePipes(ValidationPipe)
	createTask(
		@Body() body: createTaskDto,
		@GetUser() user: User,
	): Promise<Task> {
		this.logger.verbose(`User "${user.username}" is creating a new task. data ${JSON.stringify(body)}`)
		return this.tasksService.createTask(body, user)
	}

	@Patch('/:id/status')
	updateTask(
		@Param('id') id: string,
		@Body('status', TaskStatusValidationPipe) status: TaskStatus,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, status, user)
	}

	@Delete(':id')
	async deleteTask(
		@Param('id') id: number,
		@GetUser() user: User,
	): Promise<void> {
		return await this.tasksService.deleteTask(id, user)
	}
}
