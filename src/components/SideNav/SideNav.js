import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'

import NetworkInformation from '../NetworkInformation/NetworkInformation'
import Heart from '../Icons/Heart'
import File from '../Icons/File'
import { aboutPageURL, hasNonAscii } from '../../utils/utils'
import SpeechBubble from '../Icons/SpeechBubble'
import { ReactComponent as FaqIcon } from '../../assets/faqIcon.svg'

import mq from 'mediaQuery'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

const SideNavContainer = styled('nav')`
  width: 362px;
  height: 100%;
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
  }
  padding: 15px 62px 0px 100px;
  font-family: Urbanist;
  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: ${p => (p.active ? '#47C799' : '#C7D3E3')};
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  ${mq.medium`
    justify-content: start;
    border-bottom: 0;
  `}

  &:visited {
    color: #c7d3e3;
  }

  span {
    transition: 0.2s;
    margin-left: 15px;
    color: ${p => (p.active ? '#47C799' : '#B1B1B1')};
  }

  &:hover {
    span {
      color: #47c799;
    }
    path {
      fill: #47c799;
    }
    g {
      fill: #47c799;
    }
  }
`

const SIDENAV_QUERY = gql`
  query getSideNavData {
    accounts
    isReadOnly
  }
`

function SideNav({ match, isMenuOpen, toggleMenu }) {
  const { url } = match
  const { t } = useTranslation()
  const {
    data: { accounts, isReadOnly }
  } = useQuery(SIDENAV_QUERY)
  return (
    <SideNavContainer isMenuOpen={isMenuOpen} hasNonAscii={hasNonAscii()}>
      <NetworkInformation />
      <ul data-testid="sitenav">
        {accounts?.length > 0 && !isReadOnly ? (
          <li>
            <NavLink
              onClick={toggleMenu}
              active={url === '/address/' + accounts[0] ? 1 : 0}
              to={'/address/' + accounts[0]}
            >
              <File active={url === '/address/' + accounts[0]} />
              <span>{t('c.mynames')}</span>
            </NavLink>
          </li>
        ) : null}
        <li>
          <NavLink
            onClick={toggleMenu}
            active={url === '/favourites' ? 1 : 0}
            to="/favourites"
          >
            <Heart active={url === '/favourites'} />
            <span>{t('c.favourites')}</span>
          </NavLink>
        </li>
      </ul>
    </SideNavContainer>
  )
}
export default withRouter(SideNav)
