import 'source-map-support/register'

import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/TodosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')

const todosAccess = new TodosAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`Retrieving all todos for user ${userId}`, { userId })

  return await todosAccess.getTodoItems(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()
  
    const newItem: TodoItem = {
      userId,
      todoId,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: null,
      ...createTodoRequest
    }
  
    logger.info(`Creating todo ${todoId} for user ${userId}`, { userId, todoId, todoItem: newItem })
  
    await todosAccess.createTodoItem(newItem)
  
    return newItem
  }

  export async function deleteTodo(userId: string, todoId: string) {
    logger.info(`Deleting todo ${todoId} for user ${userId}`, { userId, todoId })
  
    const item = await todosAccess.getTodoItem(todoId)
  
    if (!item)
      throw new Error('Not Found')
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
      throw new Error('Forbidden')
    }
  
    todosAccess.deleteTodoItem(todoId)
  }