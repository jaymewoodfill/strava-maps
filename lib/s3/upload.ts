import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!

export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: 'gpx' | 'images'
): Promise<string> {
  const key = `${folder}/${uuidv4()}-${fileName}`

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const key = fileUrl.split('.com/')[1]

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  try {
    await s3.deleteObject(params).promise()
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Failed to delete file')
  }
}

export function getSignedUrl(key: string, expiresIn: number = 3600): string {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expiresIn,
  }

  return s3.getSignedUrl('getObject', params)
}
