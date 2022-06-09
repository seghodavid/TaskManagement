import { Test } from '@nestjs/testing'
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service'
import { TaskStatus } from './task-status.enum'

// Mocking Technique 
const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn()
})

const mockUser = {
    username: 'david',
    id: 'someId',
    password: 'SomePassword',
    tasks: []
}

describe('TaskService', () => {
    let taskService: TasksService;
    let taskRepository;

    beforeEach(async() => {
        //initialize a NestJs module with task service and task repository
        const module = await Test.createTestingModule({
            providers: [
                TaskService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile()

        taskService = module.get(TasksService)
        taskRepository = module.get(TaskRepository)
    })

    describe('getTasks', () => {
        it('calls TaskRepository.getTasks and returns the result', async () => {
            // expect(TaskRepository.getTasks).not.toHaveBeenCalled()

            taskRepository.getTasks.mockResolvedValue('SomeValue')

            const result = await taskService.getTasks(null, mockUser)

            // expect(TaskRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('...something')
        })
    })

    describe('getTaskById', () => {
        it('calls TaskRepository.findOne and returns the result', async () => {
            const mockTask = {
                title: 'Some Task',
                description: 'Task description',
                id: 'someId',
                status: TaskStatus.OPEN
            }

            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await taskService.findOne('someUser', mockUser)

            expect(result).toEqual(mockTask)
        })

        it('calls TaskRepository.findOne and handles errors', async () => {
            taskRepository.findOne.mockResolvedValue(null)

            expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException)
        })
    })
})