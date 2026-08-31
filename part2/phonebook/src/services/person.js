import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createPerson = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deletePerson = id => {
  const path = baseUrl + '/' + id
  const request = axios.delete(path)
  return request.then(response => response.data)
}

const modifyPerson = (id, newObject) => {
  const path = baseUrl + '/' + id
  const request = axios.put(path, newObject)
  return request.then((response) => response.data)
}

export default { getAll, createPerson, deletePerson, modifyPerson }
