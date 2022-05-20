import React from 'react'
import Increase from 'components/Increase'

const Years = ({ years, setYears }) => {
  const incrementYears = () => setYears(years + 1)
  const decrementYears = () => (years >= 1 ? setYears(years - 1) : null)
  return (
    <div>
      <div>
        <Increase className="mr-[13px]" years={years} decrementYears={decrementYears} incrementYears={incrementYears} setYears={setYears} />
        <div className="text-center text-white font-semibold mt-1">
          {' '}
          Registration Year{' '}
        </div>
      </div>
    </div>
  )
}

export default Years
