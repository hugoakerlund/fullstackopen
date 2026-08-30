import { useState } from 'react'

const Filter = (props) => (
  <div>
    filter shown with <input value={props.value} onChange={props.onChange}/>
  </div>
)

const Form = (props) => (
  <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.nameValue} onChange={props.nameOnChange}/>
    </div>
    <div>
      number: <input value={props.numberValue} onChange={props.numberOnChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const PersonList = (props) => (
  <div>
    {props.persons.map((person) => <Person key={person.id} name={person.name} number={person.number} /> )}
  </div>
)

const Person = (props) => (
  <p>{props.name} {props.number}</p>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const personSet = new Set(persons.map((person) => person.name))
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addEntry = (event) => {
    event.preventDefault()

    if (personSet.has(newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      setPersons(persons.concat(newPerson))
      personSet.add(newPerson)
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = newFilter.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <Form onSubmit={addEntry} nameValue={newName} numberValue={newNumber} nameOnChange={handleNameChange} numberOnChange={handleNumberChange} />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} />
    </div>
  )
}

export default App
