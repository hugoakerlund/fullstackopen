import { useState, useEffect } from 'react'
import personService from './services/person'
import Notification from './components/Notification'

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
    {props.persons.map((person, id) => <Person key={id} name={person.name} number={person.number} id={person.id} delete={props.deletePerson} /> )}
  </div>
)

const Person = (props) => (
  <p>
    {props.name} {props.number} <button onClick={() => props.delete(props.id)}>delete</button>
  </p>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const personSet = new Set(persons.map((person) => person.name))
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNewNotification] = useState({ message: null, error: false })

  useEffect(() => {
      personService
      .getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons)
      })
  }, [])

  const addEntry = (event) => {
    event.preventDefault()

    if (personSet.has(newName)) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToChange = persons.find((person) => person.name === newName)
        const changedPerson = { ...personToChange, number: newNumber }
        modifyPerson(changedPerson)
      }
    }

    else {
      const newPerson = {name: newName, number: newNumber}
      createNewPerson(newPerson)
    }

    setNewName('')
    setNewNumber('')
  }

  const modifyPerson = (changedPerson) => {
    personService
      .modifyPerson(changedPerson.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(persons.map((person) => (person.id !== changedPerson.id ? person : returnedPerson)))
        setNewNotification({ message: `Modified number belonging to '${changedPerson.name}'`, error: false })
        setTimeout(() => {
          setNewNotification({ message: null, error: false })
        }, 2000)
      })
      .catch(error => {
        setNewNotification(
          { message: `Information of '${changedPerson.name}' has already been removed from server`, error: true }
        )
        setTimeout(() => {
          setNewNotification({ message: null, error: false })
        }, 5000)
        setPersons(persons.filter((person) => person.id !== changedPerson.id))
      })
  }

  const createNewPerson = newPerson => {
    personService
      .createPerson(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        personSet.add(newPerson)
        setNewNotification({ message: `Added '${newPerson.name}'`, error: false })
        setTimeout(() => {
          setNewNotification({ message: null, error: false })
        }, 2000)
      })
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

  const handlePersonDelete = id => {
    const personToDelete = persons.find((person) => id === person.id).name
    if(confirm(`Delete ${personToDelete}?`)) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter((person) => person.id !== id))
        })
    }
  }


  const personsToShow = newFilter.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} error={notification.error} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <Form onSubmit={addEntry} nameValue={newName} numberValue={newNumber} nameOnChange={handleNameChange} numberOnChange={handleNumberChange} />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} deletePerson={handlePersonDelete} />
    </div>
  )
}

export default App
