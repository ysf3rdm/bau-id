import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import cn from 'classnames'
import axios from 'axios'

import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'

import './search.scss'
import TwoPoints from 'components/Icons/TwoPoints'
import SearchIcon from 'components/Icons/SearchIcon'
import FaceIcon from 'components/Icons/FaceIcon'

const SEARCH_QUERY = gql`
  query searchQuery {
    isENSReady @client
  }
`

function Search({ history, className, style }) {
  const [inputValue, setInputValue] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [result, setResult] = useState(null)
  const {
    data: { isENSReady }
  } = useQuery(SEARCH_QUERY)
  let input

  const handleParse = e => {
    if (!e.target.value) {
      setShowPopup(false)
    }
    setInputValue(
      e.target.value
        .split('.')
        .map(term => term.trim())
        .join('.')
    )
  }
  const hasSearch = inputValue && inputValue.length > 0

  const gotoDetailPage = () => {
    if (result.Owner) {
      history.push(`/address/${result.Owner}`)
    } else {
      history.push(`/register/${result.name}`)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <form
        className={cn(`flex relative`)}
        style={style}
        action="#"
        hasSearch={hasSearch}
        onSubmit={async e => {
          e.preventDefault()
          if (!hasSearch) return

          const params = {
            ChainID: 97,
            name: inputValue
          }

          axios
            .post(`https://space-id-348516.uw.r.appspot.com/nameof`, {
              ...params
            })
            .then(res => {
              setResult(res.data)
              setShowPopup(true)
            })
        }}
      >
        <TwoPoints className="absolute text-[#1EEFA4] left-4 top-[11px]" />
        <input
          className="w-full bg-[#104151]/[0.25] py-[10px] px-[36px] text-[#BDCED1] text-[16px] border border-[#1EEFA4] rounded-[18px]"
          placeholder="Explore the space"
          ref={el => (input = el)}
          onChange={handleParse}
          autoCapitalize="off"
        />
        <button
          className="absolute right-4 top-[14px]"
          type="submit"
          disabled={!hasSearch}
          data-testid={'home-search-button'}
        >
          <SearchIcon className="text-[#1EEFA4]" />
        </button>
        <div className="text-[#1EEFA4] font-urbanist font-semibold text-[16px] absolute right-[44px] top-[10px]">
          .bnb
        </div>
        {/* <LanguageSwitcher /> */}
      </form>
      {showPopup && (
        <div className="absolute top-[55px] shadow-popup flex w-full bg-[#205561] px-3 py-3 rounded-[12px] backdrop-blur-[5px] justify-between">
          <div className="flex items-center">
            <FaceIcon
              className={cn(result.Owner ? 'text-[#ED7E17]' : 'text-[#30DB9E]')}
            />
            <span
              className={cn(
                'ml-2 text-[16px] font-semibold',
                result.Owner ? 'text-[#ED7E17]' : 'text-[#30DB9E]'
              )}
            >
              {result.name}.bnb
            </span>
          </div>
          <div className="flex items-center">
            <div
              className={cn(
                'text-[12px]',
                result.Owner ? 'text-[#ED7E17]' : 'text-[#30DB9E]'
              )}
            >
              {result.Owner ? 'Unavailable' : 'Available'}
            </div>
            <div
              onClick={gotoDetailPage}
              className={cn(
                'cursor-pointer w-[100px] justify-center flex items-center h-[28px] text-white text-center rounded-[8px] font-urbanist font-semibold ml-3',
                result.Owner ? 'bg-[#ED7E17]' : 'bg-[#30DB9E]'
              )}
            >
              {result.Owner ? <span>View</span> : <span>Register</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({ searchDomain, className, style }) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
    />
  )
}

export { SearchWithRouter as Search }

export default SearchContainer
