import { Uploader, uploadParams } from '@/domain/application/storage/uploader'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []
  async upload({ fileName }: uploadParams): Promise<{ url: string }> {
    const url = randomUUID()
    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }

  async delete(url: string): Promise<void> {
    this.uploads = this.uploads.filter((upload) => upload.url !== url)
  }
}
