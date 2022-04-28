import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import mq from 'mediaQuery'

import { GET_REVERSE_RECORD } from 'graphql/queries'

import { getAccounts, getHomeData } from 'app/slices/accountSlice'

import SearchDefault from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal'
import bg from '../assets/heroBG.jpg'
import MaskGroup from '../assets/mask-group.png'
import ENSLogo from '../components/HomePage/images/ENSLogo.svg'
import { aboutPageURL } from '../utils/utils'
import { connectProvider, disconnectProvider } from '../utils/providerUtils'
import { gql } from '@apollo/client'
import HamburgerIcon from 'components/Icons/HamburgerIcon'
import SmallLogoIcon from 'components/Icons/SmallLogoIcon'
import MobileMenu from 'components/Menu/MobileMenu'

import UnstyledBlockies from 'components/Blockies'

import './Home.scss'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

const animation = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    opacity: 1,
    scale: 1
  }
}

export default ({ match }) => {
  const { url } = match
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNT)

  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: accounts?.[0]
    }
  })

  useEffect(() => {
    if (accounts) {
      dispatch(getAccounts(accounts))
    }
  }, [accounts])

  useEffect(() => {
    if (data?.network) {
      dispatch(getHomeData(data))
    }
  }, [data])

  const { network, displayName, isReadOnly, isSafeApp } = data

  const menuOpen = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address: accounts?.[0]
    },
    skip: !accounts?.length
  })

  return (
    <section
      style={{ background: `url(${bg})` }}
      className="pt-[60px] px-5 pb-5 bg-cover relative flex justify-center h-[100vh]"
    >
      {/* <div className="flex items-center justify-start md:justify-center top-[30px] text-[#25ffb1] absolute font-bold font-[40px] tracking-[5px] w-full text-center z-0 ml-7 md:ml-0">
        <div className="mr-[17px] md:mr-[13px] md:mt-[3px] block md:hidden">
          <SmallLogoIcon />
        </div>
        <div className="text-[34px] font-bold">SPACE ID</div>
      </div> */}

      <div className="h-[100px] flex py-[20px] px-[48px] xl:px-[48px] justify-between absolute left-0 top-0 items-center w-full">
        <div className="text-[#1EEFA4] flex items-center">
          <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
          <div className="font-semibold text-[18px] ml-[31px]">
            About SpaceID
          </div>
        </div>

        <div>
          {!isSafeApp && (
            <div className="mt-0 w-full md:w-auto flex items-center">
              <NoAccountsDefault
                active={isReadOnly ? false : true}
                onClick={isReadOnly ? connectProvider : disconnectProvider}
                buttonText={isReadOnly ? t('c.connect') : network}
              />
              {accounts && accounts[0] && (
                <div className="flex items-center ml-4">
                  {!reverseRecordLoading &&
                  getReverseRecord &&
                  getReverseRecord.avatar ? (
                    <img
                      src={imageUrl(
                        getReverseRecord.avatar,
                        displayName,
                        network
                      )}
                    />
                  ) : (
                    <UnstyledBlockies
                      className="rounded-full"
                      address={accounts[0]}
                      imageSize={45}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* <div className="hidden lg:flex justify-center items-center z-[1] font-bold">
          {accounts?.length > 0 && !isReadOnly && (
            <div className="ml-4 text-right tracking-[0.08em] min-w-[100px] first:ml-0">
              <Link
                style={{ color: '#25ffb1' }}
                active={url === '/address/' + accounts[0]}
                to={'/address/' + accounts[0]}
              >
                {t('c.mynames')}
              </Link>
            </div>
          )}
          <div className="ml-4 text-right tracking-[0.08em] min-w-[100px] font-bold first:ml-0">
            <Link style={{ color: '#25ffb1' }} to="/favourites">
              {t('c.favourites')}
            </Link>
          </div>
          <a
            className="text-right ml-4 text-[#25ffb1] min-w-[100px] font-bold font-[16px] leading-[19px] first:ml-0"
            href={aboutPageURL()}
          >
            {t('c.about')}
          </a>
        </div> */}
      </div>
      <div
        className="flex lg:hidden items-center flex absolute top-[40px] right-7 height-[100px]"
        onClick={() => menuOpen()}
      >
        <HamburgerIcon
          style={{
            color: '#25ffb1'
          }}
        />
      </div>
      <div className="my-0 mx-auto min-w-[100%] md:min-w-[60%] mt-[30vh]">
        <>
          <div className="flex justify-center text-[72px] text-[#1EEFA4] font-bold font-urbanist tracking-widest">
            SPACE ID
          </div>
          <h1
            className=""
            initial={animation.initial}
            animate={animation.animate}
          />
          <SearchDefault className="w-[512px] mx-auto" />
        </>
      </div>
      {isMenuOpen && (
        <MobileMenu
          accounts={accounts}
          isReadOnly={isReadOnly}
          url={url}
          network={network}
          displayName={displayName}
          isSafeApp={isSafeApp}
          menuOpen={menuOpen}
        />
      )}
    </section>
  )
}
