import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'
import jsonexport from 'jsonexport'

import { dirname } from '../constants.mjs'

const getTestsData = async () => {
  const url = 'https://superlikers-themes.s3.amazonaws.com/academiademantenimiento/maintenance.json'
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })

  const body = await response.json()

  return body
}

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

const getUniqueData = (data) => {
  const sortedData = [...data].sort((a, b) => b.Date - a.Date)
  const uniqueData = {}

  const excluded = ['julianclavijof@gmail.com', 'alejandro@superlikers.com']

  sortedData.forEach(item => {
    const { UID, Activity, State } = item
    const key = `${UID}-${Activity}`

    if (!uniqueData[key] && State !== 'undo' && !excluded.includes(UID)) {
      uniqueData[key] = item
    }
  })

  return Object.values(uniqueData)
}

const getCorrectAnswers = (test, item) => {
  const step = test.steps.find(step => step.page === item.Activity)

  if (step === undefined) return [0, 0]

  const questions = test.questions.filter(question => question.step === step.step)
  const correctAnswers = questions.filter(question => {
    const collator = new Intl.Collator('es', { sensitivity: 'base' })

    return collator.compare(item.data[question.name], question.value) === 0
  })
  return [questions.length, correctAnswers.length]
}

const getParticipantStepAdvance = async (data) => {
  const testsData = await getTestsData()
  const uniqueData = getUniqueData(data)

  uniqueData.forEach(item => {
    const activityType = item.Activity.split('_')[0]
    if (activityType === 'pre') {
      const pretest = testsData.pretests.find(pretest => pretest.category === item.Category)
      const [totalQuestions, correctAnswers] = getCorrectAnswers(pretest, item)
      item.totalQuestions = totalQuestions
      item.correctAnswers = correctAnswers
    }

    if (activityType === 'pos') {
      const test = testsData.tests.find(pretest => pretest.category === item.Category)
      const [totalQuestions, correctAnswers] = getCorrectAnswers(test, item)
      item.totalQuestions = totalQuestions
      item.correctAnswers = correctAnswers
    }
  })

  return uniqueData
}

export const getMaintenanceFile = async (fileName) => {
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

      data.push({ ...participant, data: ordenedRowData })
    })

    const response = await getParticipantStepAdvance(data)

    jsonexport(response, function (err, csv) {
      if (err) return console.error(err)
      fs.writeFileSync('public/files/entries/maintenance.csv', csv, 'binary')
    })

    return 'files/entries/maintenance.csv'
  } catch (err) {
    console.log(err)
    throw new Error('El archivo no tiene la configuración correcta.')
  }
}
