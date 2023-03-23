import { Router } from 'express'
import { uploadFilesOnDiskStorage, validateFile } from '../middlewares/middlewares.mjs'
import { createRadiografiaFile, getRadiografiaPage } from '../controllers/radiografia.controller.mjs'

const router = Router()

router.get('/', getRadiografiaPage)

router.post('/', [
  uploadFilesOnDiskStorage('../public/files/radiografia').single('file'),
  validateFile
], createRadiografiaFile)

export default router
