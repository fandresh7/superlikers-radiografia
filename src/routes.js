import { Router } from 'express'
import { dirname } from './constants.js';
import { uploadFilesOnDiskStorage, validateFile } from './middlewares.js';
import { getRadiografia } from './views/radiografia.js';

const router = Router()

router.get('/', (req, res) => {
  res.sendFile(dirname + '/views/index/index.html');
})

router.post('/', [
  uploadFilesOnDiskStorage().single('file'),
  validateFile
], (req, res) => {
  const url = getRadiografia(req.file.filename)
  res.status(200).json({
    ok: true,
    data: url
  })
})

export default router
