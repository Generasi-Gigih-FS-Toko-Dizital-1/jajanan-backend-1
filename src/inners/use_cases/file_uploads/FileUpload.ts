import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type CloudinaryGateway from '../../../outers/gateways/CloudinaryGateway'
import type CloudinaryUtility from '../../../outers/utilities/CloudinaryUtility'
import Result from '../../models/value_objects/Result'

export default class FileUpload {
  cloudinaryGateway: CloudinaryGateway
  cloudinaryUtility: CloudinaryUtility
  objectUtility: ObjectUtility

  constructor (cloudinaryGateway: CloudinaryGateway, cloudinaryUtility: CloudinaryUtility, objectUtility: ObjectUtility) {
    this.cloudinaryGateway = cloudinaryGateway
    this.cloudinaryUtility = cloudinaryUtility
    this.objectUtility = objectUtility
  }

  uploadFile = async (file: string): Promise<Result<string | null>> => {
    try {
      const uploadFileResponse: any = await this.cloudinaryGateway.uploadFile(file)
      return new Result<string>(
        200,
        'File upload succeed.',
        uploadFileResponse.secure_url
      )
    } catch (error) {
      return new Result<null>(
        500,
        `File upload failed: ${(error as Error).message}`,
        null
      )
    }
  }

  deleteFileByUrl = async (url: string): Promise<Result<null>> => {
    try {
      const publicId: string = this.cloudinaryUtility.extractPublicIdFromUrl(url)
      await this.cloudinaryGateway.deleteFile(publicId)
      return new Result<null>(
        200,
        'File delete succeed.',
        null
      )
    } catch (error) {
      return new Result<null>(
        500,
        `File delete failed: ${(error as Error).message}`,
        null
      )
    }
  }
}
