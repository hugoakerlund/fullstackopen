import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"
const apiKey = import.meta.env.VITE_API_KEY
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getWeather = (capital) => {
  const url = `${apiUrl}q=${capital}&appid=${apiKey}&units=metric`
  const request = axios.get(url)
  return request.then(response => response.data)
}

export default { getAll, getWeather }
