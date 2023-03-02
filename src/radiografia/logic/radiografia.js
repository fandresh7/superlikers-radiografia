import fs from 'fs'
import path from 'path'
import json2xls from 'json2xls'
import xlsx from 'node-xlsx'
import { dirname } from '../constants.js'

// Ordena la información del archivo en un objecto donde la key es el participante y el value es un objeto con la información de cada participante
const orderData = (marcas, cupos, rows) => {
  const ordenedData = {}
  marcas.forEach((marca, index) => {
    const cupo = cupos[index]
    rows.forEach(row => {
      const [participant, ...fields] = row
      const value = fields[index]

      if (!ordenedData.hasOwnProperty(participant)) {
        ordenedData[participant] = {}
      }

      const title = `${marca}-${cupo}`
      ordenedData[participant][title] = value || 0
    })
  })

  return ordenedData
}

// Obtiene los mejores 3 datos de cada participante
const getBestItems = (ordenedData) => {
  const result = []
  Object.entries(ordenedData).forEach(([participant, data]) => {
    const sortedkeys = Object.keys(data).sort((a, b) => data[b] - data[a])
    const bestSortedKeys = sortedkeys.slice(0, 3)

    const participantData = { participant }
    bestSortedKeys.forEach((key, index) => {
      const value = data[key]
      const [marca, cupo] = key.split('-')

      participantData[`value ${index}`] = value
      participantData[`marca ${index}`] = marca
      participantData[`cupo ${index}`] = cupo
    })

    result.push(participantData)
  })

  return result
}

export const getRadiografia = (fileName) => {
  try {
    const pathFile = path.resolve(dirname, `../../public/files/radiografia/${fileName}`)

    const workSheetsFromFile = xlsx.parse(pathFile)
    const fileData = workSheetsFromFile[0].data

    // Separa las filas entre marcas, cupos y los valores
    const [_, marcasFields, cuposFields, ...rows] = fileData

    // Quita el primer elemento del array que está vacio
    const [__, ...marcas] = marcasFields

    // Quitar el primer elemento del array que es "Codigo De Destinatario"
    const [___, ...cupos] = cuposFields

    const ordenedData = orderData(marcas, cupos, rows)
    const result = getBestItems(ordenedData)

    const resultFile = json2xls(result)

    fs.writeFileSync('public/files/radiografia/result.xlsx', resultFile, 'binary')

    return 'files/radiografia/result.xlsx'
  } catch (err) {
    throw new Error('El archivo no tiene la configuración correcta.')
  }
}
