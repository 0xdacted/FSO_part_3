const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(cors())


morgan.token('postData', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.message === 'Name already exists') {
    return response.status(400).json({ error: 'Name already exists in the phonebook' })
  }
  next(error)
}

app.use(errorHandler)



app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})


// const duplicateName = Person.find(person => person.name === name)
// if (duplicateName !== null) {
//   return response.status(400).json({
//     error: 'name must be unique'
//   })
// }
