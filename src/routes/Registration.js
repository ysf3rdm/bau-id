import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import cn from 'classnames'
import Increase from 'components/Increase'
import EditIcon from 'components/Icons/EditIcon'
import AnimationSpin from 'components/AnimationSpin'
import SuccessfulTickIcon from 'components/Icons/SuccessfulTickIcon'

const progresses = [
  { id: 1, name: 'Confirm Payment' },
  { id: 2, name: 'xxxxxxxxxxxxxxxxx' },
  { id: 3, name: 'xxxxxxxxxxxxxxxxx' },
  { id: 4, name: 'Successful registration. Name published' }
]

export default function Registration() {
  const [step, setStep] = useState(0)
  const [subStep, setSubStep] = useState(2)
  const { domain } = useParams()

  return (
    <div className="pt-[20vh]">
      <div className="flex justify-center">
        <div className="text-[28px] text-[#1EEFA4] font-cocoSharp py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center max-w-max px-[67px]">
          {domain}.bnb
        </div>
      </div>

      {step === 0 && (
        <div>
          <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
            <div className="flex">
              <div>
                <Increase className="mr-[13px]" />
                <div className="text-center text-white font-semibold mt-1">
                  {' '}
                  Registration Year{' '}
                </div>
              </div>

              <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 mr-[13px]">
                =
              </span>
              <div>
                <div className="w-[180px] h-[40px] flex justify-center items-center font-bold font-urbanist bg-[#C4C4C4]/20 text-white font-bold font-urbanist text-[18px] rounded-[8px]">
                  $5.55
                </div>
                <div className="text-center text-white font-semibold mt-1">
                  {' '}
                  Registration Fee{' '}
                </div>
              </div>
            </div>
            <div className="text-white py-[25px] border-y border-white border-dashed mt-6 px-6">
              <div className="flex justify-between">
                <div className="font-semibild text-[14px]">Xxxxxx Fee</div>
                <div className="font-bold text-[16px]">$2.22</div>
              </div>
              <div className="flex justify-between mt-[14px]">
                <div className="font-semibild text-[14px]">Xxxxxx Fee</div>
                <div className="font-bold text-[16px]">$1.11</div>
              </div>
              <div className="flex justify-between mt-[14px]">
                <div className="font-semibild text-[14px]">Discount</div>
                <div className="font-bold text-[16px]">-$1.11</div>
              </div>
            </div>
            <div className="text-center text-white mt-6">
              <div className="text-[14px]">Total Cost</div>
              <div className="font-bold text-[36px]">$9.99</div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button className="bg-[#30DB9E] font-semibold px-[37px] py-[9px] rounded-[16px]">
              Register
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-[436px]">
          <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
            <div className="flex justify-center">
              <EditIcon />
            </div>
            <div className="font-semibold text-[24px] text-white text-center mt-2">
              Registration in progress...
            </div>
            <div className="text-[14px] text-[#BDCED1] leading-[22px] text-center">
              Please be patient as the process might take a few minutes. You may
              click <span className="text-[#ED7E18]">here</span> to learn more
              about the registration process.
            </div>
            <div className="mt-8">
              {progresses.map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className={cn(
                      'font-semibold text-[16px]',
                      index + 1 > subStep ? 'text-[#7E9195]' : 'text-[#30DB9E]'
                    )}
                  >
                    {item.name}
                  </div>
                  {index + 1 < subStep && (
                    <SuccessfulTickIcon className="text-[#30DB9E] flex justify-center my-2" />
                  )}
                  {index + 1 === subStep && (
                    <AnimationSpin className="flex justify-center my-2" />
                  )}
                  {index + 1 > subStep && (
                    <div className="flex justify-center">
                      <div className="w-2 h-2 bg-[#7E9195] rounded-full my-[14px]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-x-[24px] mt-10">
              <button
                className={cn(
                  'py-2 border rounded-[16px] font-semibold',
                  progresses.length === subStep
                    ? 'border-[#30DB9E] text-[#30DB9E]'
                    : 'border-[#7E9195] text-[#7E9195]'
                )}
              >
                Manage profile
              </button>
              <button
                className={cn(
                  'rounded-[16px] py-2 font-semibild',
                  progresses.length === subStep
                    ? 'bg-[#30DB9E] text-[#30DB9E]'
                    : 'bg-[#7E9195] text-[#BDCED1] '
                )}
              >
                Register another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <InsufficientBalanceModal /> */}
    </div>
  )
}
