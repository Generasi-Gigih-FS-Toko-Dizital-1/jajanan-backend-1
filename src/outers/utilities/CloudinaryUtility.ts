export default class CloudinaryUtility {
  CLOUDINARY_REGEX = /^.+\.cloudinary\.com\/(?:[^\/]+\/)(?:(image|video|raw)\/)?(?:(upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/)?(?:(?:[^_/]+_[^,/]+,?)*\/)?(?:v(\d+|\w{1,2})\/)?([^\.^\s]+)(?:\.(.+))?$/

  extractPublicIdFromUrl = (url: string): string => {
    const parts: RegExpExecArray | null = this.CLOUDINARY_REGEX.exec(url)
    return (parts != null) && parts.length > 2 ? parts[parts.length - 2] : url
  }
}
