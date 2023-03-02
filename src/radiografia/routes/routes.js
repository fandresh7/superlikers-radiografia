import { Router } from 'express'
import { dirname } from '../constants.js'
import { uploadFilesOnDiskStorage, validateFile } from '../middlewares/middlewares.js'
import { getRadiografia } from '../logic/radiografia.js'

const router = Router()

router.get('/', (req, res) => {
  res.sendFile(dirname + '/views/index/index.html')
})

router.post('/', [
  uploadFilesOnDiskStorage().single('file'),
  validateFile
], (req, res) => {
  try {
    const url = getRadiografia(req.file.filename)
    res.status(200).json({
      ok: true,
      data: url
    })
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err.message
    })
  }
})

export default router
