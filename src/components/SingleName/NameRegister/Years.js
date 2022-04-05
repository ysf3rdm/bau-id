import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import CircleMinus from 'components/Icons/CircleMinus'
import mq from 'mediaQuery'
import CirclePlus from 'components/Icons/CirclePlus'

const YearsContainer = styled('div')`
  font-family: Urbanist;
  ${mq.medium`
    max-width: 220px;
  `}
`

const Stepper = styled('div')`
  display: flex;
  border-bottom: 1px solid #5ed6ab;
  width: 160px;
`

const Icon = styled('div')`
  font-family: Overpass;
  font-size: 28px;
  font-weight: 100;
  background: transparent;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  transition: 0.2s;
  border: solid #379070 1px;
  color: #379070;

  &:hover {
    border: solid #379070 1px;
    color: #379070;
    cursor: pointer;
  }
`

const Amount = styled('div')`
  width: 150px;
  padding: 0 5px;
  display: flex;
  font-family: Overpass;
  font-size: 28px;
  font-weight: 100;
  color: #379070;
  justify-self: left;
  align-self: center;

  input {
    background: transparent;
    font-family: Overpass;
    font-size: 28px;
    font-weight: 100;
    color: #47c799;
    border: none;
    max-width: 26px;
    outline: 0;
    text-align: right;
    margin-right: 12px;
  }
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 12px;
  color: #adbbcd;
  margin-top: 3px;
  text-align: center;
`

const CircleIconContainer = styled('div')`
  color: #379070;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Years = ({ years, setYears }) => {
  const { t } = useTranslation()
  const incrementYears = () => setYears(years + 1)
  const decrementYears = () => (years >= 1 ? setYears(years - 1) : null)
  const currentLanguage = window.localStorage.getItem('language')
  return (
    <YearsContainer>
      <Stepper>
        <CircleIconContainer onClick={decrementYears}>
          <CircleMinus size={24} />
        </CircleIconContainer>
        <Amount>
          <input
            type="text"
            value={years}
            aria-label={t('pricer.yearUnit')}
            onChange={e => {
              const sign = Math.sign(e.target.value)
              if (sign === -1 || isNaN(sign)) {
                setYears(0)
              } else {
                setYears(Number(e.target.value))
              }
            }}
          />{' '}
          {t('pricer.yearUnit')}
          {currentLanguage === 'en' && years > 1 && 's'}
        </Amount>
        <CircleIconContainer onClick={incrementYears}>
          <CirclePlus size={24} />
        </CircleIconContainer>
      </Stepper>
      <Description>{t('pricer.registrationPeriodLabel')}</Description>
    </YearsContainer>
  )
}

export default Years
