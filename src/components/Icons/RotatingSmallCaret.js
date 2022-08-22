import React from 'react'
import { ReactComponent as DefaultSmallCaret } from './SmallCaret.svg'

export default function RotatingSmallCaret({
  start = 'right',
  rotated,
  highlight = 'false',
  testid
}) {
  if (start === 'right') {
    return (
      <div
        className="shrink-0 duration-200"
        style={{ transform: rotated ? 'rotate(0)' : 'rotate(-90deg)' }}
      >
        <DefaultSmallCaret
          rotated={rotated ? 1 : 0}
          highlight={highlight}
          data-testid={testid}
        />
      </div>
    )
  } else if (start === 'top') {
    return (
      <div
        className="shrink-0 duration-200"
        style={{ transform: rotated ? 'rotate(-180deg)' : 'rotate(0)' }}
      >
        <DefaultSmallCaret
          rotated={rotated ? 1 : 0}
          highlight={highlight}
          data-testid={testid}
        />
      </div>
    )
  }
}
