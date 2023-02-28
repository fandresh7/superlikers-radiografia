import path from 'path'
import multer from 'multer'

import { dirname } from './constants.js'

export const uploadFilesOnDiskStorage = () => {
  const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const filePath = path.resolve(dirname, '../public')
      cb(null, filePath)
    },
    filename: (_req, _file, cb) => {
      cb(null, `basedata.xlsx`)
    }
  })

  return multer({
    storage: diskStorage
  })
}

export const uploadFilesOnMemoryStorage = () => {
  const memoryStorage = multer.memoryStorage()

  return multer({
    storage: memoryStorage
  })
}


export const validateFile = (req, res, next) => {
  if ((req.file === undefined)) {
    res.status(400).json({
      ok: false,
      error: 'The field "file" is required'
    })

    return
  }

  next()
}
