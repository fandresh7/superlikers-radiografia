import { Router } from 'express'

import { uploadFilesOnDiskStorage, validateFile } from '../middlewares/middlewares.mjs'
import { getEntriesPage, createEntriesFile, getMaintenanceData } from '../controllers/entries.controller.mjs'

const router = Router()

router.get('/', getEntriesPage)

router.post('/', [
  uploadFilesOnDiskStorage('../public/files/entries').single('file'),
  validateFile
], createEntriesFile)

router.post('/maintenance', [
  uploadFilesOnDiskStorage('../public/files/entries').single('file')
], getMaintenanceData)

export default router
