import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>{props.text}</button>
)

const StatisticLine = (props) => (
  <p>{props.text} {props.value}</p>
)

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  if (all == 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  const average = (props.good - props.bad) / all
  const positive = (props.good / all) * 100
  return (
    <div>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} />
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
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

