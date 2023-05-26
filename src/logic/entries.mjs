import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'
import jsonexport from 'jsonexport'

import { dirname } from '../constants.mjs'

const getParticipantInfo = (titles, participantInfo) => {
  const data = {}

  titles.forEach((key, index) => {
    data[key] = participantInfo[index]
  })

  return data
}

const getRowData = (rowData) => {
  const data = {}
  const keys = rowData.filter((_, index) => index % 2 === 0)
  const values = rowData.filter((_, index) => index % 2 !== 0)

  keys.forEach((key, index) => {
    data[key] = values[index]
  })

  return data
}

export const getEntriesFile = (fileName) => {
  try {
    const pathFile = path.resolve(dirname, `../public/files/entries/${fileName}`)

    const workSheetsFromFile = xlsx.parse(pathFile)
    const fileData = workSheetsFromFile[0].data

    const [titles, ...table] = fileData

    const COLUMN_ID = titles.length // Columna desde donde comienzan los datos del external

    const data = []
    table.forEach(row => {
      const participantInfo = row.slice(0, COLUMN_ID)
      const rowData = row.slice(COLUMN_ID, row.length)

      const ordenedRowData = getRowData(rowData)
      const participant = getParticipantInfo(titles, participantInfo)

      data.push({ ...participant, ...ordenedRowData })
    })

    jsonexport(data, function (err, csv) {
      if (err) return console.error(err)
      fs.writeFileSync('public/files/entries/result.csv', csv, 'binary')
    })

    return 'files/entries/result.csv'
  } catch (err) {
    console.log(err)
    throw new Error('El archivo no tiene la configuración correcta.')
  }
}
