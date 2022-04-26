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

const Nav = styled('div')`
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1;
  a {
    font-weight: 700;
    color: white;
  }
  ${mq.lg`
    display: flex;
  `}
`

const NavLink = styled(Link)`
  margin-left: 16px;
  text-align: right;
  color: #25ffb1 !important;
  letter-spacing: 0.08em;
  min-width: 100px !important;
  &:first-child {
    margin-left: 0;
  }
`

const ExternalLink = styled('a')`
  text-align: right;
  margin-left: 16px;
  color: #25ffb1 !important;
  min-width: 100px !important;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  &:first-child {
    margin-left: 0;
  }
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  ${mq.medium`
    min-width: 60%;
  `}
  > h2 {
    color: white;
    font-size: 38px;
    font-weight: 100;
    margin-bottom: 10px;
  }

  > h3 {
    color: white;
    font-weight: 100;
    font-size: 24px;
    margin-top: 0;
  }
`

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

const LogoLarge = styled(motion.img)`
  width: 50%;
  margin: 0 auto 0;
  width: 120px;
`

const PermanentRegistrarLogo = styled(motion.h1)`
  font-family: Urbanist;
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  color: #4258d3;
  letter-spacing: 1.8px;
  text-align: right;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 50px;
  text-align: center;
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

  const {
    // data: { network, displayName, isReadOnly, isSafeApp }
    data
  } = useQuery(HOME_DATA, {
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
        <div className="mr-[13px] mt-[3px] hidden md:block">
          <SmallLogoIcon />
        </div>
        <div>SPACE ID</div>
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
        className="flex lg:hidden items-center flex absolute top-[5px] right-7 height-[100px]"
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
            className="w-[50%] my-0 mx-auto w-[120px]"
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
