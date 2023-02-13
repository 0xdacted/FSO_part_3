const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


personsRouter.get('/info', (request, response) => {
  Person.countDocuments({}, (error, count) => {
    if (error) {
      return response.status(500).json({ error: 'Failed to retrieve count from database' })
    }
    const date = new Date()
    response.send(`Phonebook has info for ${count} people. <p>${date}</p>`)
  })
})

personsRouter.post('/', (request, response, next) => {
  const name = request.body.name
  const number = request.body.number

  if (name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.find({ name: name })
    .then(persons => {
      if (persons.length > 0) {
        return response.status(409).json({
          error: `Name '${name}' already exists in the phonebook`
        })
      }
      const person = new Person({
        name: name,
        number: number,
        date: new Date()
      })
      return person.save()
    })
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {

  const number = request.body.number
  Person.findByIdAndUpdate(request.params.id, number, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = personsRouter