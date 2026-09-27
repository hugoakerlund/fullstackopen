require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())

morgan.token("data", (req) => JSON.stringify(req.body));
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.data(req, res)
  ].join(' ')}
))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path )
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


let persons = []

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
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
  })
  .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


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

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
