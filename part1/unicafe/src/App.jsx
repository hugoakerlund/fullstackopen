import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>{props.text}</button>
)

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
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App

