import { Router } from 'express'
import { dirname } from '../constants.mjs'

const router = Router()

router.get('/', (req, res) => {
  res.sendFile(dirname + '/views/index/index.html')
})

export default router
