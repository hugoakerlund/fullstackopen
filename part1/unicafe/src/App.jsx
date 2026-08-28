import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>{props.text}</button>
)

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const average = (props.good - props.bad) / all
  const positive = (props.good / all) * 100
  return (
    <div>
      <h1>statistics</h1>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>positive {positive} %</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const giveGoodFeedback = () => {
    setGood(good + 1)
  }

  const giveNeutralFeedback = () => {
    setNeutral(neutral + 1)
  }

  const giveBadFeedback = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => giveGoodFeedback() } text="good" />
      <Button onClick={() => giveNeutralFeedback() } text="neutral" />
      <Button onClick={() => giveBadFeedback() } text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

