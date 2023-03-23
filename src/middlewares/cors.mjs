import cors from 'cors'

export const configureCors = (allowedOrigins = []) => {
  return cors({
    origin: function (origin, callback) {
      console.log({ origin, allowedOrigins })
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  })
}
