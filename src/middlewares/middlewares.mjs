import path from 'path'
import multer from 'multer'

import { dirname } from '../constants.mjs'

export const uploadFilesOnDiskStorage = (relativePath) => {
  const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const filePath = path.resolve(dirname, relativePath)
      cb(null, filePath)
    },
    filename: (_req, file, cb) => {
      cb(null, file.originalname)
    }
  })

  return multer({
    storage: diskStorage,
    limits: { fileSize: 80000000 }
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
      message: 'El archivo es requerido'
    })

    return
  }

  next()
}
