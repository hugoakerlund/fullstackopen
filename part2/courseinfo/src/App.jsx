const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
      {props.parts.map((part) =>
      <Part key={part.id} part={part} />
      )}
  </div>
)

const Part = (props) => (
  <p>{props.part.name} {props.part.exercises}</p>
)

const Total = (props) => <p><b>Number of exercises {props.total}</b></p>

const Course = (props) => {
  const name = props.course.name
  const parts = props.course.parts
  const total = parts.reduce((a, b) => a + b.exercises, 0)

  return (
    <>
      <Header course={name} />
      <Content parts={parts} />
      <Total total={total} />
    </>
  )
}

const App = () => {
  const title = "Web development curriculum"
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
    <h1>{title}</h1>
      {courses.map((course) =>
        <Course key={course.id} course={course} />
      )}
    </div>
  )

}

export default App
