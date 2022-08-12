import React from 'react'
import { Button } from 'react-daisyui'
import { Link } from 'react-router-dom'

export default function Error404() {
  return (
    <div className='min-h-[100vh] bg-[url("assets/images/home-bg.png")] flex items-center justify-center bg-no-repeat bg-cover'>
      <div className="text-center space-y-12 relative">
        <div className="text-[160px] font-bold left-[calc(50%-135px)] top-[80px] leading-[66px] absolute text-[rgba(204,252,255,0.2)]">
          404
        </div>
        <p className="font-bold text-[72px] text-[#1EEFA4]">Oops!</p>
        <p className="text-[#1EEFA4] text-[32px] leading-[46px] font-bold font-urbanist">
          We can't find the page you're looking for...
        </p>
        <div>
          <Link to="/">
            <Button className="text-[#1EEFA4] border-[#1EEFA4] border rounded-full font-bold text-[24px] leading-[34px] py-3 px-8 font-cocoSharp">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
