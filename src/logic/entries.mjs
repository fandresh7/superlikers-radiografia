import fs from 'fs'
import path from 'path'
import json2xls from 'json2xls'
import xlsx from 'node-xlsx'
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
  const keys = rowData.filter((item, index) => index % 2 === 0)
  const values = rowData.filter((item, index) => index % 2 !== 0)

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

    const resultFile = json2xls(data)
    fs.writeFileSync('public/files/entries/result.xlsx', resultFile, 'binary')

    return 'files/entries/result.xlsx'
  } catch (err) {
    throw new Error('El archivo no tiene la configuración correcta.')
  }
}
