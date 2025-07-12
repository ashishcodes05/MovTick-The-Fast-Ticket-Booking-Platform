import React from 'react'

const TimeConverter = ({ timeInMinutes }) => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  return (
    <span className='text-sm text-white'>
      {hours > 0 && <span>{hours}h </span>}
      <span>{minutes}m</span>
    </span>
  )
}

export default TimeConverter;
