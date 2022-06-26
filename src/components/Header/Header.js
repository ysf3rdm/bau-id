import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, gql } from '@apollo/client'
import styled from '@emotion/styled/macro'

import mq from 'mediaQuery'

import { getAccounts, getHomeData } from 'app/slices/accountSlice'

import DefaultLogo from '../Logo'
import Search from '../SearchName/Search'
import Banner from '../Banner'
import searchIcon from '../../assets/searchWhite.svg'

import { hasNonAscii } from '../../utils/utils'
import HamburgerIcon from 'components/Icons/HamburgerIcon'
import MobileMenu from 'components/Menu/MobileMenu'

const StyledBanner = styled(Banner)`
  margin-bottom: 0;
  text-align: center;
  z-index: 1;
  margin-top: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mq.medium`
    top: 90px;
    position: fixed;
    margin-top: 0;
  `}
`

const StyledBannerInner = styled('div')`
  max-width: 720px;
`

const Header = styled('header')`
  background: #18e199;
  display: flex;
  width: 100%;
  z-index: 2;
  height: 80px;
  align-items: center;
  padding: 0px 100px;
  @media (max-width: 768px) {
    display: block;
    padding: 0px;
  }
`

const SearchHeader = styled(Search)`
  width: 100%;
  @media (max-width: 768px) {
    background: rgba(24, 225, 153, 0.6);
    height: 56px;
  }
  ${mq.medium`
    margin-top: 0;
    height: 54px;
    border: 1px solid #ffffff;
    border-radius: 16px;
    // overflow: hidden;
  `}

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
    background: #18e199;
    color: #ffffff;
    font-size: 20px;
    border-radius: 16px;
    margin-right: 48px;
    &::placeholder {
      color: rgba(255, 255, 255, 0.75);
    }
  }

  button {
    background: transparent;
  }
`

const Logo = styled(DefaultLogo)``

const LogoContainer = styled('div')`
  background: #18e199;
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  @media (max-width: 768px) {
    padding: 0px 28px;
    justify-content: space-between;
  }
`

const HamburgerIconContainer = styled('div')`
  color: white;
  display: none;
  @media (max-width: 768px) {
    display: block;
    margin-top: 5px;
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
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

function HeaderContainer() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!isMenuOpen)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const account = useSelector(state => state.account)

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

  return (
    <>
      <Header isMenuOpen={isMenuOpen}>
        <LogoContainer>
          <Logo isMenuOpen={isMenuOpen} />
          <HamburgerIconContainer onClick={toggleMenu}>
            <HamburgerIcon style={{ color: 'white' }} />
          </HamburgerIconContainer>
        </LogoContainer>
        <SearchHeader />
      </Header>
      {hasNonAscii() && (
        <StyledBanner>
          <StyledBannerInner>
            <p>
              ⚠️ <strong>{t('warnings.homoglyph.title')}</strong>:{' '}
              {t('warnings.homoglyph.content')}{' '}
              <a
                target="_blank"
                href="https://en.wikipedia.org/wiki/IDN_homograph_attack"
                rel="noreferrer"
              >
                {t('warnings.homoglyph.link')}
              </a>
              .
            </p>
          </StyledBannerInner>
        </StyledBanner>
      )}
      {isMenuOpen && (
        <MobileMenu
          accounts={account.accounts}
          isReadOnly={account.isReadOnly}
          url={window.location.pathname}
          network={account.network}
          displayName={account.displayName}
          isSafeApp={account.isSafeApp}
          menuOpen={toggleMenu}
        />
      )}
    </>
  )
}

export default HeaderContainer
