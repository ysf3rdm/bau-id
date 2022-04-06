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

const HeroTop = styled('div')`
  display: flex;
  padding: 20px 60px;
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100px;
  align-items: center;
  font-family: 'CocoSharp';
  ${mq.xLarge`
    padding: 20px 100px;
  `}
`

const NoAccounts = styled(NoAccountsDefault)`
  margin-top: 0;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const HamburgerIconContainer = styled('div')`
  display: flex;
  align-items: center;
  display: flex;
  position: absolute;
  top: 5px;
  right: 28px;
  height: 100px;
  ${mq.lg`
    display: none;
  `}
`

const NetworkStatus = styled('div')`
  color: white;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  z-index: 1;
  letter-spacing: 0.08em;

  @media (max-width: 768px) {
    display: none;
  }

  &:before {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(-5px, -50%);
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
`

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

const Hero = styled('section')`
  background: url(${bg});
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  ${mq.medium`
    padding: 0 20px 0;
  `}
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

const TextLogoContainer = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  top: 30px;
  color: #25ffb1;
  font-weight: 700;
  font-size: 40px;
  letter-spacing: 5px;
  position: absolute;
  width: 100%;
  text-align: center;
  z-index: 0;
  @media (max-width: 768px) {
    justify-content: flex-start;
    margin-left: 28px;
  }
`

const SmallLogoIconContainer = styled.div`
  margin-right: 13px;
  margin-top: 3px;
  ${mq.medium`
    display: none;
  `}
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
    <Hero>
      <TextLogoContainer>
        <SmallLogoIconContainer>
          <SmallLogoIcon />
        </SmallLogoIconContainer>
        <div>SPACE ID</div>
      </TextLogoContainer>

      <HeroTop>
        <NetworkStatus>
          {!isSafeApp && (
            <NoAccounts
              active={isReadOnly ? false : true}
              onClick={isReadOnly ? connectProvider : disconnectProvider}
              buttonText={isReadOnly ? t('c.connect') : t('c.disconnect')}
            />
          )}
        </NetworkStatus>

        <Nav>
          {accounts?.length > 0 && !isReadOnly && (
            <NavLink
              active={url === '/address/' + accounts[0]}
              to={'/address/' + accounts[0]}
            >
              {t('c.mynames')}
            </NavLink>
          )}
          <NavLink to="/favourites">{t('c.favourites')}</NavLink>
          <ExternalLink href={aboutPageURL()}>{t('c.about')}</ExternalLink>
        </Nav>
      </HeroTop>
      <HamburgerIconContainer onClick={() => menuOpen()}>
        <HamburgerIcon
          style={{
            color: '#25ffb1'
          }}
        />
      </HamburgerIconContainer>
      <SearchContainer>
        <>
          <LogoLarge
            initial={animation.initial}
            animate={animation.animate}
            src={ENSLogo}
            alt="SID logo"
          />
          <PermanentRegistrarLogo
            initial={animation.initial}
            animate={animation.animate}
          />
          <Search />
        </>
      </SearchContainer>
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
    </Hero>
  )
}
