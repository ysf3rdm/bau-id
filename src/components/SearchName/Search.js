import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import cn from 'classnames'
import axios from 'axios'
import { Formik } from 'formik'

import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'

import './search.scss'
import TwoPoints from 'components/Icons/TwoPoints'
import SearchIcon from 'components/Icons/SearchIcon'
import FaceCryIcon from 'components/Icons/FaceCryIcon'
import FaceHappyIcon from 'components/Icons/FaceHappyIcon'

function Search({ history, className, style }) {
  const [showPopup, setShowPopup] = useState(false)
  const [result, setResult] = useState(null)

  const gotoDetailPage = () => {
    if (result.Owner) {
      history.push(`/address/${result.Owner}`)
    } else {
      // history.push(`/register/${result.name}`)
      history.push(`/name/${result.name}.bnb/register`)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Formik
        initialValues={{ searchKey: '' }}
        validate={values => {
          const errors = {}
          if (values.searchKey.length < 3) {
            errors.searchKey = 'Name length must be at least 3 characters'
          } else if (
            !new RegExp(/^[a-z0-9\p{Emoji}]*$/u).test(values.searchKey)
          ) {
            errors.searchKey =
              'Name can only contain lowercase letters, numbers and emojis'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          const params = {
            ChainID: 97,
            name: values.searchKey
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
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit
          /* and other goodies */
        }) => (
          <form
            className={cn(`relative`)}
            style={style}
            onSubmit={handleSubmit}
          >
            <TwoPoints className="absolute text-[#1EEFA4] left-4 top-[11px]" />
            <div>
              <input
                className="w-full bg-[#104151]/[0.25] py-[10px] px-[36px] text-[#BDCED1] text-[16px] border border-[#1EEFA4] rounded-[18px]"
                placeholder="Explore the space"
                onChange={e => {
                  setShowPopup(false)
                  handleChange(e)
                }}
                type="text"
                name="searchKey"
                onBlur={handleBlur}
                value={values.searchKey}
                autoCapitalize="off"
              />
            </div>
            {errors.searchKey && touched.searchKey && (
              <div className="text-[#ED7E17] text-[16px] font-semibold mt-1 ml-3">
                {errors.searchKey}
              </div>
            )}
            <button
              className="absolute right-4 top-[14px]"
              type="submit"
              data-testid={'home-search-button'}
            >
              <SearchIcon className="text-[#1EEFA4]" />
            </button>
            <div className="text-[#1EEFA4] font-urbanist font-semibold text-[16px] absolute right-[44px] top-[10px]">
              .bnb
            </div>
          </form>
        )}
      </Formik>
      {showPopup && (
        <div className="absolute top-[55px] shadow-popup flex w-full bg-[#205561] px-3 py-3 rounded-[12px] backdrop-blur-[5px] justify-between">
          <div className="flex items-center">
            {result.Owner ? (
              <FaceCryIcon className="text-[#ED7E17]" />
            ) : (
              <FaceHappyIcon className="text-[#30DB9E]" />
            )}

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
