import { useState, useEffect } from 'react'
import countryService from './services/countries'

const CountryList = (props) => {
  if (props.countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if (props.countries.length == 1) {
    const country = props.countries['0']
    return (
      <CountryPage country={country} />
    )
  }

  return (
    <div>
      {props.countries.map((country, i) => <Country key={i} country={country} />)}
    </div>
  )
}

const Country = (props) => (
  <>
    {props.country.name.common} <br />
  </>
)

const CountryPage = (props) => {
    const country = props.country
    const name = country.name.common
    const languages = Object.values(country.languages)
    const capital = country.capital['0']
    const area = country.area
    const flag = country.flags['png']
    return (
      <div>
        <h1>{name}</h1>
        Capital {capital} <br />
        Area {area} <br />
        <h2>Languages</h2>
        <ul>
          {languages.map((language, i) => <li key={i}>{language}</li>)}
        </ul>
        <img src={flag}/>
      </div>
    )
}

const App = () => {

  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(returnedData => {
        setCountries(returnedData)
      })
  }, [])

  const handleCountryChange = (event) => {
    setNewFilter(event.target.value)
  }

  const countriesToShow = newFilter.length > 0
    ? countries.filter((country) => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
    : countries

  return (
    <div>
      find countries <input value={newFilter} onChange={handleCountryChange}/>
      <CountryList countries={countriesToShow} />
    </div>
  )
}

export default App
