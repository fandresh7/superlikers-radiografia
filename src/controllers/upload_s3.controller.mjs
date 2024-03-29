
import AWS from 'aws-sdk'
import config from '../config.mjs'

export const uploadFile = (req, res) => {
  try {
    AWS.config.update({
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY
    })

    const s3 = new AWS.S3({ region: 'us-east-1' })

    const originalName = req.file.originalname
    const fileName = originalName.split('.')[0]
    const fileType = originalName.split('.')[1]

    const date = new Date().getTime()
    const newFileName = `${fileName}-${date}.${fileType}`

    const params = {
      Bucket: config.S3_BUCKET,
      Key: `photos_register/${newFileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    }

    s3.putObject(params, (err, data) => {
      if (err) {
        res.status(400).json({
          ok: false,
          error: `Ha ocurrido un error - ${err.message}`
        })
      } else {
        res.status(200).json({
          ok: true,
          url: `${config.S3_URL}/photos_register/${newFileName}`
        })
      }
    })
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err.message
    })
  }
}
