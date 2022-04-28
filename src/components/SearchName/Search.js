import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import cn from 'classnames'

import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import searchIcon from '../../assets/search.svg'
import mq from 'mediaQuery'
import LanguageSwitcher from '../LanguageSwitcher'

import './search.scss'
import TwoPoints from 'components/Icons/TwoPoints'
import SearchIcon from 'components/Icons/SearchIcon'

const SEARCH_QUERY = gql`
  query searchQuery {
    isENSReady @client
  }
`

function Search({ history, className, style }) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(null)
  const {
    data: { isENSReady }
  } = useQuery(SEARCH_QUERY)
  let input

  const handleParse = e => {
    setInputValue(
      e.target.value
        .split('.')
        .map(term => term.trim())
        .join('.')
    )
  }
  const hasSearch = inputValue && inputValue.length > 0 && isENSReady
  return (
    <form
      className={cn(`flex relative`, className)}
      style={style}
      action="#"
      hasSearch={hasSearch}
      onSubmit={async e => {
        e.preventDefault()
        if (!hasSearch) return
        const type = await parseSearchTerm(inputValue)
        let searchTerm
        if (input && input.value) {
          // inputValue doesn't have potential whitespace
          searchTerm = inputValue.toLowerCase()
        }
        if (!searchTerm || searchTerm.length < 1) {
          return
        }

        if (type === 'address') {
          history.push(`/address/${searchTerm}`)
          return
        }

        input.value = ''
        if (type === 'supported' || type === 'short') {
          history.push(`/name/${searchTerm}`)
          return
        } else {
          history.push(`/search/${searchTerm}`)
        }
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
