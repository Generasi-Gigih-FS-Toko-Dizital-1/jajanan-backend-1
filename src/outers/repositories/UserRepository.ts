import type OneDatastore from '../datastores/OneDatastore'
import { Prisma, type User } from '@prisma/client'
import type UserAggregate from '../../inners/models/aggregates/UserAggregate'
import RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class UserRepository {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  count = async (repositoryArgument: RepositoryArgument): Promise<number> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const count: number = await this.oneDatastore.client.user.count(args)

    return count
  }

  readManyByDistanceAndSubscribedVendorIds = async (distance: number, vendorIds: string[], include: any): Promise<User[] | UserAggregate[]> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const query: string = `
    select s1.u_id
    from (select v.id  as v_id,
                 u.id  as u_id,
                 st_distance(
                         st_makepoint(v."lastLatitude", v."lastLongitude"),
                         st_makepoint(u."lastLatitude", u."lastLongitude")
                     ) as vu_distance
          from "Vendor" v
                   inner join "JajanItem" ji on v."id" = ji."vendorId"
                   inner join "Category" C on C.id = ji."categoryId"
                   inner join "UserSubscription" us on us."categoryId" = C.id
                   inner join "User" u on u.id = us."userId") as s1
    where s1.vu_distance <= ${distance}
      and s1.v_id in (${vendorIds.map((vendorId: string) => `'${vendorId}'`).join(', ')});
    `
    const foundUserIds: any[] = await this.oneDatastore.client.$queryRaw`${Prisma.raw(query)}`

    const repositoryArgument: RepositoryArgument = new RepositoryArgument(
      { id: { in: foundUserIds.map((row: any) => row.u_id) } },
      include,
      undefined,
      undefined
    )
    const foundUsers: User[] | UserAggregate[] = await this.readMany(repositoryArgument)

    return foundUsers
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<User[] | UserAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUsers: User[] | UserAggregate[] = await this.oneDatastore.client.user.findMany(args)
    if (foundUsers === null) {
      throw new Error('Found users is undefined.')
    }

    return foundUsers
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdUser: User | UserAggregate = await this.oneDatastore.client.user.create(args)

    return createdUser
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }

    return foundUser
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: User | UserAggregate = await this.oneDatastore.client.user.update(args)
    if (patchedUser === null) {
      throw new Error('Patched user is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUser: User | UserAggregate = await this.oneDatastore.client.user.delete(args)

    return deletedUser
  }
}
