import type UserRepository from '../../../outers/repositories/UserRepository'
import Result from '../../models/value_objects/Result'
import { type User } from '@prisma/client'

export default class UserManagement {
  userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  readAll = async (): Promise<Result<User[]>> => {
    const foundUsers: any[] = await this.userRepository.readAll()
    return new Result<User[]>(
      200,
      'User read all succeed.',
      foundUsers
    )
  }

  readOneById = async (id: string): Promise<Result<User>> => {
    const foundUser: any = await this.userRepository.readOneById(id)
    return new Result<User>(
      200,
      'User read one by id succeed.',
      foundUser
    )
  }

  readOneByUsername = async (username: string): Promise<Result<User>> => {
    const foundUser: any = await this.userRepository.readOneByUsername(username)
    return new Result<User>(
      200,
      'User read one by username succeed.',
      foundUser
    )
  }

  readOneByEmail = async (email: string): Promise<Result<User>> => {
    const foundUser: any = await this.userRepository.readOneByEmail(email)
    return new Result<User>(
      200,
      'User read one by email succeed.',
      foundUser
    )
  }

  readOneByUsernameAndPassword = async (username: string, password: string): Promise<Result<User | null>> => {
    const foundUser: any | null = await this.userRepository.readOneByUsernameAndPassword(username, password)
    return new Result<User | null>(
      200,
      'User read one by username and password succeed.',
      foundUser
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<User | null>> => {
    const foundUser: any | null = await this.userRepository.readOneByEmailAndPassword(email, password)
    return new Result<User | null>(
      200,
      'User read one by email and password succeed.',
      foundUser
    )
  }

  createOne = async (user: User): Promise<Result<User>> => {
    const createdUser: any = await this.userRepository.createOne(user)
    return new Result<User>(
      201,
      'User create one succeed.',
      createdUser
    )
  }

  patchOneById = async (id: string, user: User): Promise<Result<User>> => {
    const patchedUser: any = await this.userRepository.patchOneById(id, user)
    return new Result<User>(
      200,
      'User patch one by id succeed.',
      patchedUser
    )
  }

  deleteOneById = async (id: string): Promise<Result<User>> => {
    const deletedUser: any = await this.userRepository.deleteOneById(id)
    return new Result<User>(
      200,
      'User delete one by id succeed.',
      deletedUser
    )
  }
}
