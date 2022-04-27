import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import mq from 'mediaQuery'

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

const Search = styled(SearchDefault)`
  min-width: 90%;
  border-radius: 16px;
  background: rgba(147, 196, 178, 0.08);
  border: 3px solid #25ffb1;
  // overflow: hidden;
  height: 54px;
  ${mq.medium`
    min-width: 780px;
  `}

  input {
    width: 100%;
    border-radius: 0px;
    background: rgba(147, 196, 178, 0.08);
    box-sizing: border-box;
    color: #25ffb1;
    &::placeholder {
      color: rgba(147, 255, 216, 0.5);
    }
    ${mq.medium`
      border-radius: 6px 0 0 6px;
      font-size: 20px;
    `}
  }

  button {
    border-radius: 0 6px 6px 0;
    background: rgba(147, 196, 178, 0.08);
  }
`

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

  return (
    <section
      style={{ background: `url(${bg})` }}
      className="pt-[60px] px-5 pb-5 bg-cover relative flex justify-center items-center h-[100vh]"
    >
      <div className="flex items-center justify-start md:justify-center top-[30px] text-[#25ffb1] absolute font-bold font-[40px] tracking-[5px] w-full text-center z-0 ml-7 md:ml-0">
        <div className="mr-[17px] md:mr-[13px] md:mt-[3px] block md:hidden">
          <SmallLogoIcon />
        </div>
        <div className="text-[34px] font-bold">SPACE ID</div>
      </div>

      <div className="h-[100px] flex py-[20px] px-[60px] xl:px-[100px] justify-between absolute left-0 top-0 w-full items-center">
        <div className="text-white font-bold font-[16px] leading-[19px] capitalize hidden md:flex items-center z-[1] tracking-[0.08em] before:absolute before:right-[100%] before:top-[50%] before:translate-x-[-5px] before:translate-y-[-50%] before:block before:w-[6px] before:h-[6px] before:rounded-[50%] before:bg-white">
          {!isSafeApp && (
            <div className="mt-0 w-full md:w-auto">
              <NoAccountsDefault
                active={isReadOnly ? false : true}
                onClick={isReadOnly ? connectProvider : disconnectProvider}
                buttonText={isReadOnly ? t('c.connect') : t('c.disconnect')}
              />
            </div>
          )}
        </div>

        <div className="hidden lg:flex justify-center items-center z-[1] font-bold">
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
        </div>
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
      <div className="my-0 mx-auto flex flex-col min-w-[100%] md:min-w-[60%]">
        <>
          <img
            className="w-[50%] my-0 mx-auto w-[120px] mb-[50px]"
            initial={animation.initial}
            animate={animation.animate}
            src={ENSLogo}
            alt="SID logo"
          />
          <h1
            className=""
            initial={animation.initial}
            animate={animation.animate}
          />
          {/* <div className='min-w-[90%] rounded-[16px] bg-[#93c4b214] border-[3px] border-[#25ffb1] h-[54px]'>
            <SearchDefault />
          </div> */}
          <Search />
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
