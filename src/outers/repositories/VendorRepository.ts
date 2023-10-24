import type OneDatastore from '../datastores/OneDatastore'
import { Prisma, type Vendor } from '@prisma/client'
import type VendorAggregate from '../../inners/models/aggregates/VendorAggregate'
import RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'
import type Pagination from '../../inners/models/value_objects/Pagination'
import VendorManagementReadOneByDistanceAndLocationResponse
  from '../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementReadOneByDistanceAndLocationResponse'
import VendorManagementReadManyByDistanceAndLocationResponse
  from '../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementReadManyByDistanceAndLocationResponse'

export default class VendorRepository {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readManyByDistanceAndSubscribedUserIds = async (distance: number, userIds: string[], include: any): Promise<Vendor[] | VendorAggregate[]> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const query: string = `
    select s1.v_id
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
      and s1.u_id in (${userIds.map((userId: string) => `'${userId}'`).join(', ')});
    `
    const foundVendorIds: any[] = await this.oneDatastore.client.$queryRaw`${Prisma.raw(query)}`

    const repositoryArgument: RepositoryArgument = new RepositoryArgument(
      { id: { in: foundVendorIds.map((row: any) => row.v_id) } },
      include,
      undefined,
      undefined
    )
    const foundVendors: Vendor[] | VendorAggregate[] = await this.readMany(repositoryArgument)

    return foundVendors
  }

  readManyByDistanceAndLocation = async (distance: number, latitude: number, longitude: number, pagination: Pagination, where: any, include: any): Promise<VendorManagementReadManyByDistanceAndLocationResponse> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const query: string = `
    select 
        s1.v_id,
        s1.v_distance
    from (
        select 
            v.id  as v_id,
            st_distance(
                st_makepoint(v."lastLatitude", v."lastLongitude"),
                st_makepoint(${latitude}, ${longitude})
            ) as v_distance
        from "Vendor" v
    ) as s1
    where s1.v_distance <= ${distance}
    order by s1.v_distance asc;
    `
    const foundVendorIdsAndDistance: any[] = await this.oneDatastore.client.$queryRaw`${Prisma.raw(query)}`

    const repositoryArgument: RepositoryArgument = new RepositoryArgument(
      { ...where, id: { in: foundVendorIdsAndDistance.map((row: any) => row.v_id) } },
      include,
      pagination,
      undefined
    )
    const foundVendors: Vendor[] | VendorAggregate[] = await this.readMany(repositoryArgument)

    const nearbyVendors: VendorManagementReadOneByDistanceAndLocationResponse[] = foundVendors.map((foundVendor: Vendor | VendorAggregate) => {
      return new VendorManagementReadOneByDistanceAndLocationResponse(
        foundVendor,
        foundVendorIdsAndDistance.find((row: any) => row.v_id === foundVendor.id).v_distance
      )
    })

    const response: VendorManagementReadManyByDistanceAndLocationResponse = new VendorManagementReadManyByDistanceAndLocationResponse(
      nearbyVendors.length,
      nearbyVendors
    )

    return response
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<Vendor[] | VendorAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendors: Vendor[] | VendorAggregate[] = await this.oneDatastore.client.vendor.findMany(args)
    if (foundVendors === null) {
      throw new Error('Found vendors is undefined.')
    }

    return foundVendors
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.create(args)

    return createdVendor
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }

    return foundVendor
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.update(args)
    if (patchedVendor === null) {
      throw new Error('Patched vendor is undefined.')
    }

    return patchedVendor
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.delete(args)

    return deletedVendor
  }

  patchMany = async (repositoryArguments: RepositoryArgument[]): Promise<Vendor[] | VendorAggregate[]> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const operations: any[] = []
    for (const repositoryArgument of repositoryArguments) {
      const args: any = repositoryArgument.convertToPrismaArgs()
      const operation: any = this.oneDatastore.client.vendor.update(args)
      operations.push(operation)
    }

    const patchedVendors: Vendor[] | VendorAggregate[] = await this.oneDatastore.client.$transaction(operations)

    return patchedVendors
  }
}
