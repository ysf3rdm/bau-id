import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { GET_REVERSE_RECORD } from 'graphql/queries'

import { getAccounts, getHomeData } from 'app/slices/accountSlice'

import NoAccountsDefault from 'components/NoAccounts/NoAccounts'
import bg from 'assets/heroBG.jpg'
import { connectProvider, disconnectProvider } from 'utils/providerUtils'
import SmallLogoIcon from 'components/Icons/SmallLogoIcon'
import MobileMenu from 'components/Menu/MobileMenu'

import UnstyledBlockies from 'components/Blockies'
import TwitterIcon from 'components/Icons/TwitterIcon'
import DiscordIcon from 'components/DiscordIcon'
import RoundedIcon from 'components/Icons/RoundedIcon'

import LanguageSwitcher from 'components/LanguageSwitcher'
import Modal from 'components/Modal/Modal'

import { GET_ERRORS } from 'graphql/queries'

import useReactiveVarListeners from 'hooks/useReactiveVarListeners'
import { Search } from 'components/SearchName/Search'
import InnerSearch from 'components/SearchName/InnerSearch'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
    loadingWallet
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export default ({ children }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  console.log('location', location)
  const history = useHistory()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [avatarPopup, setAvatarPopup] = useState(false)

  useReactiveVarListeners()
  const {
    data: { globalError }
  } = useQuery(GET_ERRORS)

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

  const { network, displayName, isReadOnly, isSafeApp, loadingWallet } = data

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

  const showAvatarPopup = () => {
    setAvatarPopup(!avatarPopup)
  }

  const changeToBSCChain = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }] // chainId must be in hexadecimal numbers
    })
    window.location.reload()
  }

  const moveToProfile = () => {
    history.push('/profile')
  }

  return (
    <section
      style={{ background: `url(${bg})` }}
      className="bg-cover relative min-h-[100vh]"
    >
      {globalError.network && (
        <Modal width="574px">
          <div className="text-[white]">
            <div className="text-[28px] font-cocoSharp text-center font-bold">
              Unsupported Network :(
            </div>
            <div className="text-urbanist font-semibold text-center mt-4">
              Please change your dapp browser to Binance Smart Chain Mainnet to
              continue.
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => changeToBSCChain()}
                className="mt-[36px] bg-[#30DB9E] rounded-full text-[14px] font-[urbanist] py-2 px-[36px] text-[#134757] font-semibold"
              >
                Switch to BSC
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="h-[100px] flex py-[20px] px-[48px] xl:px-[48px] justify-between items-center w-full">
        <a
          href="https://space.id/"
          className="text-[#1EEFA4] flex items-center cursor-pointer visited:text-[#1EEFA4]"
        >
          <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
          <div className="font-semibold text-[18px] ml-[31px]">
            About <span className="uppercase">Space ID</span>
          </div>
        </a>

        <div className="relative">
          {!isSafeApp && (
            <div className="mt-0 w-full md:w-auto flex items-center">
              {location.pathname !== '/' && <InnerSearch className="mr-4" />}

              <NoAccountsDefault
                onClick={connectProvider}
                loadingWallet={loadingWallet}
                buttonText={isReadOnly ? t('c.connect') : network}
              />
              {accounts && accounts[0] && (
                <div
                  className="flex items-center ml-4 cursor-pointer"
                  onClick={() => {
                    showAvatarPopup()
                  }}
                >
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
          {accounts && accounts[0] && avatarPopup && (
            <div className="absolute w-[266px] h-auto bg-[#0E4549] right-0 top-[60px] rounded-[24px] p-4">
              <div>
                <div className="flex items-center border-b-[2px] border-[#7E9195] pb-4 flex justify-between">
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
                      imageSize={64}
                    />
                  )}
                  <div className="font-semibold text-[20px] font-urbanist text-white ml-4">{`${accounts[0].substring(
                    0,
                    6
                  )}....${accounts[0].substring(
                    accounts[0].length - 6,
                    accounts[0].length
                  )}`}</div>
                </div>
              </div>
              <div
                className="font-semibold text-white font-urbanist text-[18px] text-center pt-4"
                onClick={showAvatarPopup}
              >
                <div
                  className="font-semibold h-[40px] flex items-center justify-center cursor-pointer hover:bg-[#1C585A] hover:rounded-[12px]"
                  onClick={moveToProfile}
                >
                  Manage Account
                </div>
                {/* <div className="font-semibold h-[40px] flex items-center justify-center cursor-pointer hover:bg-[#1C585A] hover:rounded-[12px]">
                  Change Wallet
                </div> */}
                <div
                  className="h-[40px] flex items-center justify-center cursor-pointer hover:bg-[#1C585A] hover:rounded-[12px]"
                  onClick={disconnectProvider}
                >
                  Disconnect
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer component in the home page */}
      <div className="h-[44px] flex py-[20px] px-[64px] xl:px-[48px] justify-between absolute left-0 bottom-0 items-center w-full bg-[#071A2F]">
        <div className="flex items-center">
          <a target="_blank" href="https://twitter.com/SpaceIDProtocol">
            <TwitterIcon className="mr-2 text-[#30DB9E]" />
          </a>
          <a target="_blank" href="https://discord.com/invite/2qrrf79K2A">
            <DiscordIcon className="mr-2 text-[#30DB9E]" />
          </a>
          <a target="_blank" href="https://medium.com/@SpaceIDProtocol">
            <RoundedIcon />
          </a>
        </div>
        <div>
          <LanguageSwitcher />
        </div>
      </div>

      {children}

      {isMenuOpen && (
        <MobileMenu
          accounts={accounts}
          isReadOnly={isReadOnly}
          network={network}
          displayName={displayName}
          isSafeApp={isSafeApp}
          menuOpen={menuOpen}
        />
      )}
    </section>
  )
}
