import { dirname } from '../constants.mjs'
import { getRadiografia } from '../logic/radiografia.mjs'

export const getRadiografiaPage = async (req, res) => {
  res.sendFile(dirname + '/views/radiografia/radiografia.html')
}

export const createRadiografiaFile = (req, res) => {
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
}
