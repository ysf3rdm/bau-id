import React from 'react'

export default function MaskAvatarIcon({ size = 60 }) {
  return (
    <div>
      <svg width={size} viewBox="0 0 60 60" fill="none">
        <mask
          id="mask0_240_1647"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="60"
          height="60"
        >
          <circle cx="30" cy="30" r="30" fill="#C4C4C4" />
        </mask>
        <g mask="url(#mask0_240_1647)">
          <rect x="-4" y="-10" width="68" height="74" fill="url(#pattern0)" />
        </g>
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use transform="translate(-0.00430416) scale(0.0132712 0.0121951)" />
          </pattern>
          <image id="image0_240_1647" width="76" height="82" />
        </defs>
      </svg>
    </div>
  )
}
