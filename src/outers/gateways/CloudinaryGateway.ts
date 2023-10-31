import { v2 as cloudinary } from 'cloudinary'

export default class CloudinaryGateway {
  cloudinary: any
  constructor () {
    this.cloudinary = cloudinary
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
  }

  getDetail = async (publicId: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
      this.cloudinary.api.resource(publicId, (error: any, result: any) => {
        if (error !== undefined && error !== null) {
          reject(new Error(error))
        }
        resolve(result)
      })
    })
  }

  uploadFile = async (file: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload(file, (error: any, result: any) => {
        if (error !== undefined && error !== null) {
          reject(new Error(error))
        }
        resolve(result)
      })
    })
  }

  deleteFile = async (publicId: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
        if (error !== undefined && error !== null) {
          reject(new Error(error))
        }
        resolve(result)
      })
    })
  }
}
