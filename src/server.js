import express from 'express'
import cors from 'cors'

import radiografiaRoutes from './routes/radiografia.routes.mjs'
import uploadS3Routes from './routes/upload_s3.routes.mjs'

export class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT ?? '3000'

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.app.use(cors())

    this.app.use(express.static('public'))

    this.app.use(express.urlencoded({ extended: false }))

    this.app.use(express.json())
  }

  routes () {
    this.app.use('/radiografia', radiografiaRoutes)
    this.app.use('/upload_s3', uploadS3Routes)
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(`Server running on PORT ${this.port}`)
    })
  }
}
