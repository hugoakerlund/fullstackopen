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
      {props.countries.map((country, i) => {
        if (props.showView.get(country.name.common) === true) {
          return <CountryPage key={i} country={country} />
        }
        return <Country key={i} country={country} showView={props.showView} handleViewChange={props.handleViewChange} />
        }
      )}
    </div>
  )
}

const Country = (props) => (
    <>
      {props.country.name.common}  <button onClick={() => props.handleViewChange(props.country.name.common)}>Show</button> <br />
    </>
)

const CountryPage = (props) => {
    const country = props.country
    const name = country.name.common
    const languages = Object.values(country.languages)
    const capital = country.capital['0']
    const area = country.area
    const flag = country.flags['png']
    const [weatherData, setWeatherData] = useState({ temperature: null, windSpeed: null, iconUrl: null })

    useEffect(() => {
      countryService
        .getWeather(capital)
        .then(returnedData => {
          const icon = returnedData.weather['0'].icon
          const iconUrl = `https://openweathermap.org/payload/api/media/file/${icon}.png`
          setWeatherData({ temperature: returnedData.main.temp, windSpeed: returnedData.wind.speed, iconUrl: iconUrl })
      })
    }, [])

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
        <h2>Weather in {capital}</h2>
        Temperature {weatherData.temperature} Celsius <br />
        <img src={weatherData.iconUrl}/> <br />
        Wind {weatherData.windSpeed} m/s <br />
      </div>
    )
}

const App = () => {

  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [showView, setShowView] = useState(new Map())

  useEffect(() => {
    countryService
      .getAll()
      .then(returnedData => {
        setCountries(returnedData)
        let newShowView = new Map()
        for (let i = 0; i < returnedData.length; ++i) {
          let name = returnedData[i].name.common
          newShowView.set(name, false)
        }
        setShowView(newShowView)
      })
  }, [])

  const handleCountryChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleViewChange = (name) => {
    let copy = new Map(showView)
    copy.set(name, !copy[name])
    setShowView(copy)
  }

  const countriesToShow = newFilter.length > 0
    ? countries.filter((country) => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
    : countries

  return (
    <div>
      find countries <input value={newFilter} onChange={handleCountryChange}/>
      <CountryList countries={countriesToShow} showView={showView} handleViewChange={handleViewChange} />
    </div>
  )
}

export default App
