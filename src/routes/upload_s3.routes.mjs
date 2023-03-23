import { Router } from 'express'
import { uploadFilesOnMemoryStorage, validateFile } from '../middlewares/middlewares.mjs'
import { uploadFile } from '../controllers/upload_s3.controller.mjs'

const router = Router()

router.post('/', [
  uploadFilesOnMemoryStorage().single('file'),
  validateFile
], uploadFile)

export default router
