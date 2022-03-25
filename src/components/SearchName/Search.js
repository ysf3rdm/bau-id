import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import searchIcon from '../../assets/search.svg'
import mq from 'mediaQuery'
import LanguageSwitcher from '../LanguageSwitcher'

const SearchForm = styled('form')`
  display: flex;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon}) no-repeat;
  }

  input {
    padding: 20px 0 20px 55px;
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccd4da;
    }
  }

  button {
    ${p => (p && p.hasSearch ? 'background: #5284ff;' : 'background: #c7d3e3;')}
    color: white;
    font-size: 22px;
    font-family: Overpass;
    height: 90px;
    width: 162px;
    border: none;
    display: none;
    ${mq.medium`
      display: block;
    `}

    &:hover {
      ${p => (p && p.hasSearch ? 'cursor: pointer;' : 'cursor: default;')}
    }
  }
`

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
    <SearchForm
      className={className}
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
      <input
        placeholder={t('search.placeholder')}
        ref={el => (input = el)}
        onChange={handleParse}
        autoCapitalize="off"
      />
      <LanguageSwitcher />
      <button
        style={{ height: 54, fontSize: 20, cursor: 'pointer', width: 40 }}
        disabled={!hasSearch}
        type="submit"
        data-testid={'home-search-button'}
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.655 18.9989L16.6896 15.0452C17.969 13.4152 18.6632 11.4024 18.6607 9.33033C18.6607 7.48497 18.1134 5.68104 17.0882 4.14668C16.063 2.61231 14.6058 1.41642 12.9009 0.710233C11.196 0.00404265 9.31998 -0.180729 7.51007 0.179284C5.70017 0.539296 4.03766 1.42792 2.73279 2.73279C1.42792 4.03766 0.539296 5.70017 0.179284 7.51007C-0.180729 9.31998 0.00404265 11.196 0.710233 12.9009C1.41642 14.6058 2.61231 16.063 4.14668 17.0882C5.68104 18.1134 7.48497 18.6607 9.33033 18.6607C11.4024 18.6632 13.4152 17.969 15.0452 16.6896L18.9989 20.655C19.1073 20.7643 19.2363 20.8511 19.3784 20.9103C19.5205 20.9695 19.673 21 19.8269 21C19.9809 21 20.1334 20.9695 20.2755 20.9103C20.4176 20.8511 20.5466 20.7643 20.655 20.655C20.7643 20.5466 20.8511 20.4176 20.9103 20.2755C20.9695 20.1334 21 19.9809 21 19.8269C21 19.673 20.9695 19.5205 20.9103 19.3784C20.8511 19.2363 20.7643 19.1073 20.655 18.9989ZM2.33259 9.33033C2.33259 7.94631 2.743 6.59337 3.51192 5.44259C4.28084 4.29182 5.37374 3.3949 6.65241 2.86526C7.93108 2.33561 9.33809 2.19704 10.6955 2.46705C12.053 2.73705 13.2998 3.40353 14.2785 4.38218C15.2571 5.36083 15.9236 6.60771 16.1936 7.96514C16.4636 9.32257 16.325 10.7296 15.7954 12.0083C15.2658 13.2869 14.3688 14.3798 13.2181 15.1487C12.0673 15.9177 10.7144 16.3281 9.33033 16.3281C7.47441 16.3281 5.69451 15.5908 4.38218 14.2785C3.06985 12.9662 2.33259 11.1862 2.33259 9.33033Z"
            fill="#FFFFFF"
          />
        </svg>
      </button>
    </SearchForm>
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
