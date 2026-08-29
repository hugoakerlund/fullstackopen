import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const personSet = new Set(persons.map((person) => person.name))
  const [newName, setNewName] = useState('')

  const addNumber = (event) => {
    event.preventDefault()

    if (personSet.has(newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const newPerson = {
        name: newName
      }
      setPersons(persons.concat(newPerson))
      personSet.add(newPerson)
    }

    setNewName('')
  }

  const handleNumberChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNumber}>
        <div>
          name: <input value={newName} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person, i) => <p key={i}>{person.name}</p>)}
    </div>
  )
}

export default App
