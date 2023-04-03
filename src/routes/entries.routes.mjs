import { Router } from 'express'

import { uploadFilesOnDiskStorage, validateFile } from '../middlewares/middlewares.mjs'
import { getEntriesPage, createEntriesFile } from '../controllers/entries.controller.mjs'

const router = Router()

router.get('/', getEntriesPage)

router.post('/', [
  uploadFilesOnDiskStorage('../public/files/entries').single('file'),
  validateFile
], createEntriesFile)

export default router
