import React from 'react'

const offset = 180

const statesIndex = {
  COMMIT_CONFIRMED: 0,
  AWAITING_REGISTER: 1,
  REVEAL_SENT: 2,
  REVEAL_CONFIRMED: 3
}

const Step = ({ number, text, title, progress = 100, step = 0 }) => (
  <div className='flex'>
    <div className='flex items-center'>
      <div completed={number < statesIndex[step] + 1}>{number}</div>
      <div>
        <h3 style={{ color: '#379070' }}>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  </div>
)

export default Step
