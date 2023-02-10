const express = require('express')
const app = express()

app.use(express.json())

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


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } 
  else {
    response.status(404).end()
  }
})

app.get('/api/info', (request, response) =>{
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people. <p>${date}</p>`)
})

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number
 
  const person = {
    name: name,
    number: number,
    date: new Date(),
    id: Math.random() * 10
  }
  console.log(person)
  persons = persons.concat(person)
  response.json
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const filteredPersons = persons.filter(person => person.id !== id)
  persons = filteredPersons
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
