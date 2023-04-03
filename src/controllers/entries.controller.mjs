import { dirname } from '../constants.mjs'
import { getEntriesFile } from '../logic/entries.mjs'

export const getEntriesPage = async (req, res) => {
  res.sendFile(dirname + '/views/entries.html')
}

export const createEntriesFile = (req, res) => {
  try {
    const url = getEntriesFile(req.file.filename)
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
