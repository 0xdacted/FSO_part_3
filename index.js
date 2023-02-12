require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(cors())



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('postData', function (req, res) {
  return JSON.stringify(req.body);
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  })
  .catch(error => next(error))
  })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) =>{
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people. <p>${date}</p>`)
})

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number

  // const duplicateName = Person.find(person => person.name === name)
  if (name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  // if (duplicateName !== null) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }
  
  if (number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    id: Math.random() * 10,
    name: name,
    number: number,
    date: new Date()
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => {
    console.error(error);
    response.status(500).json({ error: 'Failed to save person to the database' });
  })
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
