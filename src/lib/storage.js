import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Private file storage for the template zips. Works with any S3-compatible bucket,
 * including Cloudflare R2.
 *
 *   S3_ENDPOINT           e.g. https://<account-id>.r2.cloudflarestorage.com  (omit for AWS S3)
 *   S3_REGION             "auto" for R2, otherwise the bucket's region
 *   S3_BUCKET
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *
 * Zips live at templates/<slug>/<slug>-<version>.zip. scripts/template-publish.mjs uploads them
 * there (it builds the same key, so keep the two in sync).
 */

let client

function getClient() {
  if (client) return client

  const { S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env
  if (!S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
    throw new Error('Storage is not configured. Set S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY.')
  }

  client = new S3Client({
    region: process.env.S3_REGION ?? 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
  })
  return client
}

export const zipKey = (slug, version) => `templates/${slug}/${slug}-${version}.zip`

/** A short-lived URL. The long-lived part is the signed token in the email, not this URL. */
export async function getSignedZipUrl({ slug, version, expiresInSeconds = 300 }) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: zipKey(slug, version),
    ResponseContentDisposition: `attachment; filename="${slug}-${version}.zip"`,
  })
  return getSignedUrl(getClient(), command, { expiresIn: expiresInSeconds })
}
