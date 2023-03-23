import { Router } from 'express'
import { uploadFilesOnMemoryStorage, validateFile } from '../middlewares/middlewares.mjs'
import { uploadFile } from '../controllers/upload_s3.controller.mjs'
import { configureCors } from '../middlewares/cors.mjs'

const router = Router()

router.post('/', [
  configureCors(['https://tu.superlikers.com', 'https://www.ppmuniversity-abinbev.com']),
  uploadFilesOnMemoryStorage().single('file'),
  validateFile
], uploadFile)

export default router
