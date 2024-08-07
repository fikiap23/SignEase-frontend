import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const QuizLesson = ({ data }) => {
  const [displayTable, setDisplayTable] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('')

  // Function to generate a random background color class
  const getRandomBackgroundColor = () => {
    const colors = [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  useEffect(() => {
    setBackgroundColor(getRandomBackgroundColor())
  }, [])

  return (
    // Asl Lesson Container
    <div className={`banner-container-style ${backgroundColor} my-3`}>
      <div className="relative p-4 z-10">
        {/* Header */}
        <div className="text-gray-100">
          {/* Lesson Number and Pages */}
          <p className="font-bold opacity-80 uppercase tracking-wider text-shadow">
            Quiz {data.lesson.number} - {data.lesson.title}
          </p>
          <div className="flex flex-col sm:flex-row justify-between">
            {/* Subject Title */}
            <div>
              <h4 className="font-bold text-2xl sm:text-3xl md:text-4xl text-shadow">
                {data.lesson.title}
              </h4>
              <p className="font-bold opacity-80 tracking-wider text-shadow">
                {`Total Questions: ${data.signs.length}`}
              </p>
            </div>
            <div className="flex items-end mt-4 sm:mt-0 gap-4 font-bold">
              {/* Start Quiz Button */}
              <Link
                to={`/quiz/start/${data.slug}`}
                className="w-full h-fit sm:w-32 p-2 sm:px-4 border-2 border-white bg-white hover:bg-gray-200 hover:border-gray-200 text-gray-800 rounded-xl flex items-center justify-center"
              >
                Start Quiz
              </Link>

              {/* Display Table Button */}
              <button
                className="w-full h-fit sm:w-32 p-2 sm:px-4 border-2 border-gray-100 bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm text-shadow rounded-xl"
                onClick={() => setDisplayTable(!displayTable)}
              >
                {displayTable ? 'Hide Table' : 'Show Table'}
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        {displayTable && (
          <table className="table-auto mt-4 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800 text-sm sm:text-base">
                <th className="p-3">Sign</th>
                <th className="p-3">Word</th>
                <th className="p-3">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {data.signs.map((sign) => (
                <tr key={`id-${sign.label}`}>
                  <td className="w-fit border-2 dark:border-gray-700 p-2 sm:p-4 text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-center scale-150 md:scale-100">
                    <img
                      src={sign.imageUrl}
                      alt={sign.label}
                      className="w-20 h-20"
                    />
                  </td>
                  <td className="w-1/2 border-2 dark:border-gray-700 p-2 sm:p-4 text-xl sm:text-2xl md:text-3xl">
                    {sign.label}
                  </td>
                  <td className="w-1/2 border-2 dark:border-gray-700 p-2 sm:p-4 md:text-xl">
                    {sign.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className={`banner-bg-style ${data.backgroundImage}`} />
    </div>
  )
}

export default QuizLesson
