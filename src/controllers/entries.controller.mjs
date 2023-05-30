import { dirname } from '../constants.mjs'
import { getEntriesFile } from '../logic/entries.mjs'
import { getMaintenanceFile } from '../logic/maintenance.mjs'

export const getEntriesPage = async (req, res) => {
  res.sendFile(dirname + '/views/entries/entries.html')
}

export const createEntriesFile = async (req, res) => {
  try {
    let url = null

    if (req.body.type === 'maintenance') {
      url = await getMaintenanceFile(req.file.filename)
    } else {
      url = getEntriesFile(req.file.filename)
    }

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
