import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type FileManagement from '../../../inners/use_cases/managements/FileManagement'
import SingleFileUploadResponse
  from '../../../inners/models/value_objects/responses/file_uploads/SingleFileUploadResponse'
import formidable, { type File } from 'formidable'

export default class FileControllerRest {
  router: Router
  fileUpload: FileManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, fileUpload: FileManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.fileUpload = fileUpload
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('', this.uploadFile)
    this.router.delete('', this.deleteFile)
  }

  uploadFile = (request: Request, response: Response): void => {
    const form = formidable({ multiples: true })
    form.parse(request, (error, fields, files) => {
      if (error !== undefined && error !== null) {
        response.status(500).send(
          new ResponseBody(
                `File upload failed: ${JSON.stringify(error)}`,
                null
          )
        )
        return
      }
      const fileValues: File[] = (Object.values(files) as File[][])?.flat()
      if (fileValues.length <= 0) {
        response.status(400).send(
          new ResponseBody(
            'FileManagement upload failed: No file found.',
            null
          )
        )
        return
      }

      this.fileUpload
        .uploadFile(fileValues[0].filepath)
        .then((result: Result<string | null>) => {
          let data: SingleFileUploadResponse | null
          if (result.status === 200 && result.data !== null) {
            data = new SingleFileUploadResponse(
              result.data
            )
          } else {
            data = null
          }
          const responseBody: ResponseBody<SingleFileUploadResponse | null> = new ResponseBody<SingleFileUploadResponse | null>(
            result.message,
            data
          )
          response.status(result.status).send(responseBody)
        })
        .catch((error: Error) => {
          response.status(500).send(
            new ResponseBody(
                        `File upload failed: ${error.message}`,
                        null
            )
          )
        })
    })
  }

  deleteFile = (request: Request, response: Response): void => {
    const { url } = request.query

    if (url === undefined || url === null) {
      const responseBody: ResponseBody<null> = new ResponseBody<null>(
        'Url query parameter is required.',
        null
      )
      response.status(400).send(responseBody)
      return
    }

    this.fileUpload
      .deleteFileByUrl(url as string)
      .then((result: Result<null>) => {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          result.message,
          result.data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(
          new ResponseBody(
              `File delete failed: ${error.message}`,
              null
          )
        )
      })
  }
}
