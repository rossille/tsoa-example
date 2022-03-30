import { Body, Controller, Delete, Get, Post, Put, Res, Route, Tags, TsoaResponse } from 'tsoa'
import { v4 } from 'uuid'

interface UserData {
  firstName: string
  lastName: string
}

interface User extends UserData {
  id: string
}

export interface ErrorDescription {
  reason: string
}

// mock "service layer", for demonstration purpose
const users: User[] = []

@Tags('Users')
@Route('users')
export class UsersController extends Controller {
  @Post()
  async addUser (@Body() userData: UserData): Promise<User> {
    const id = v4()
    const user = { id, ...userData }
    users.push(user)
    return user
  }

  @Get()
  async listUsers (): Promise<User[]> {
    return users
  }

  @Get('{userId}')
  async getUser (userId: string, @Res() notFound: TsoaResponse<404, ErrorDescription>): Promise<User> {
    const user = users.find(user => user.id === userId)

    if (!user) {
      return notFound(404, { reason: 'not found' })
    }

    return user
  }

  @Put('{userId}')
  async updateUser (userId: string, @Body() userData: UserData): Promise<User> {
    let user = users.find(user => user.id === userId)
    if (user) {
      Object.assign(user, userData)
    } else {
      user = { id: v4(), ...userData }
      users.push(user)
    }
    return user
  }

  @Delete('{userId}')
  async deleteUser (userId: string, @Res() notFound: TsoaResponse<404, ErrorDescription>): Promise<void> {
    const indexToDelete = users.findIndex(user => user.id === userId)

    if (indexToDelete === -1) {
      return notFound(404, { reason: 'not found' })
    }

    users.splice(indexToDelete, 1)
  }
}
