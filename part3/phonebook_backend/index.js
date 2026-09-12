const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>')
})

app.get('/info', (request, response) => {
  let count = persons.length
  let date = new Date()
  let msg =`<p>Phonebook has info for ${count} people</p> </br> ${date}`
  response.send(msg)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  let max = 100000
  let min = 10
  const id = Math.round(Math.random() * (max - min) + min);
  return String(id)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const name = body.name
  const number = body.number

  if (!name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(person => person.name === name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  }

  persons = persons.concat(person)
  response.json(persons)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
