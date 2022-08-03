import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import SmallLogoIcon from 'components/Icons/SmallLogoIcon'
import HamburgerIcon from 'components/Icons/HamburgerIcon'
import NoAccountsDefault from 'components/NoAccounts/NoAccountsModal'
import { connectProvider, disconnectProvider } from 'utils/providerUtils'
import MaskGroup from '../../assets/mask-group.png'
import { aboutPageURL } from 'utils/utils'
import mq from 'mediaQuery'

const Menu = styled.div`
  margin: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  overflow: hidden;
  background-color: #18e199;
  z-index: 100;
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

const MobileNavMenu = styled.div`
  margin-top: 100px;
  text-align: center;
  color: white;
  font-family: Urbanist;
  font-size: 24px;
`

const MobileNavLink = styled(Link)`
  color: white !important;
  margin-top: 24px;
  display: block;
`

const MobileNavExternalLink = styled('a')`
  color: white !important;
  margin-top: 24px;
  display: block;
`

const Network = styled('div')`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`

const NetworkLabelContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 4px;
`

const NoAccounts = styled(NoAccountsDefault)`
  margin-top: 0;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const ConnectButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const MobileConnect = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 28px;
`

const ReadOnly = styled('span')`
  margin-left: 1em;
`

const Point = styled('div')`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #628ffd;
  margin-right: 8px;
`

const Name = styled.div`
  display: flex;
  align-items: center;
`

const Image = styled('img')`
  width: 60px;
  height: 60px;
  margin-right: 17px;
`

export default function MobileMenu({
  accounts,
  isReadOnly,
  url,
  network,
  displayName,
  isSafeApp,
  menuOpen,
}) {
  const { t } = useTranslation()
  return (
    <Menu>
      <TextLogoContainer style={{ color: 'white' }}>
        <SmallLogoIconContainer>
          <SmallLogoIcon style={{ color: 'white' }} />
        </SmallLogoIconContainer>
        <div>SPACE ID</div>
      </TextLogoContainer>
      <HamburgerIconContainer onClick={() => menuOpen()}>
        <HamburgerIcon style={{ color: 'white' }} />
      </HamburgerIconContainer>
      <MobileNavMenu>
        {accounts?.length > 0 && !isReadOnly && (
          <MobileNavLink
            active={url === '/address/' + accounts[0]}
            to={'/address/' + accounts[0]}
          >
            {t('c.mynames')}
          </MobileNavLink>
        )}
        <MobileNavLink to="/favourites">{t('c.favourites')}</MobileNavLink>
        <MobileNavLink>FAQ</MobileNavLink>
        <MobileNavExternalLink href={aboutPageURL()}>
          {t('c.about')}
        </MobileNavExternalLink>
      </MobileNavMenu>
      <MobileConnect>
        <Network>
          <Image src={MaskGroup} alt="mask-group-image" />
          <div>
            <div>
              {isReadOnly && <ReadOnly>{t('c.readonly')}</ReadOnly>}
              {!isReadOnly && displayName && (
                <Name data-testid="display-name">{displayName}</Name>
              )}
            </div>
            <NetworkLabelContainer>
              <Point />
              {`${network} ${t('c.network')}`}
            </NetworkLabelContainer>
          </div>
        </Network>
        <ConnectButtonContainer>
          {!isSafeApp && (
            <NoAccounts
              active={isReadOnly ? false : true}
              onClick={isReadOnly ? connectProvider : disconnectProvider}
              buttonText={isReadOnly ? 'Connect' : 'Disconnect'}
            />
          )}
        </ConnectButtonContainer>
      </MobileConnect>
    </Menu>
  )
}
