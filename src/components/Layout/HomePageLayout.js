// Import packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { getNetworkId } from '@siddomains/ui'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

// Import components
import NoAccountsDefault from 'components/NoAccounts/NoAccounts'
import SmallLogoIcon from 'components/Icons/SmallLogoIcon'
import UnstyledBlockies from 'components/Blockies'
import AnimationSpin from 'components/AnimationSpin'
import DomainList from 'routes/Profile/components/Sidebar/DomainList'
import {
  TwitterIcon,
  DiscordIcon,
  RoundedIcon,
  HamburgerIcon
} from 'components/Icons'
import Modal from 'components/Modal/Modal'
import { Search } from 'components/SearchName/Search'
import ProfileCard from 'routes/Profile/components/Sidebar/ProfileCard'

// Import graphql quires
import { GET_REVERSE_RECORD } from 'graphql/queries'
import { setSelectedDomain } from 'app/slices/domainSlice'

// Import redux assets
import { getAccounts, getHomeData } from 'app/slices/accountSlice'

// Import assets
import bg from 'assets/heroBG.jpg'

// Import custom functions
import { connectProvider, disconnectProvider } from 'utils/providerUtils'
import { EMPTY_ADDRESS } from 'utils/records'
import { GET_ERRORS } from 'graphql/queries'

//Import Assets
import LogoText from '../../assets/images/space-logo-text.png'

// Import custom hooks
import useReactiveVarListeners from 'hooks/useReactiveVarListeners'
import useDeviceSize from '../../hooks/useDeviceSize'

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
  const history = useHistory()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [avatarPopup, setAvatarPopup] = useState(false)
  const [networkId, setNetworkID] = useState('')

  const domains = useSelector(state => state.domain.domains)
  const selectedDomain = useSelector(state => state.domain.selectedDomain)
  useReactiveVarListeners()

  const { windowDimenion } = useDeviceSize()

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

  const initActions = async () => {
    const networkId = await getNetworkId()
    setNetworkID(networkId)
  }

  const { network, displayName, isReadOnly, isSafeApp, loadingWallet } = data

  useEffect(() => {
    if (!isReadOnly && accounts?.[0] !== EMPTY_ADDRESS) {
      initActions()
    }
  }, [isReadOnly, accounts])

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

  const selectDomain = async (domain, index) => {
    dispatch(setSelectedDomain(domain))
  }

  const changeToBSCChain = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }]
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                rpcUrls: [
                  'https://apis-sj.ankr.com/bc19fe97c68d4a99a059465623e46b3e/bb63faaa8f178d26aac2969443ec7e73/binance/full/test'
                ] /* ... */
              }
            ]
          })
        } catch (addError) {
          console.log()
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
    // https://data-seed-prebsc-1-s1.binance.org:8545/
    window.location.reload()
  }

  const moveToProfile = () => {
    history.push('/profile')
  }

  return (
    <section
      style={{ background: `url(${bg})` }}
      className="bg-cover relative min-h-[100vh] flex items-center justify-center"
    >
      {globalError.network && (
        <Modal width="574px">
          <div className="text-[white]">
            <div className="text-[24px] md:text-[28px] font-cocoSharp text-center font-bold">
              Unsupported Network :(
            </div>
            <div className="text-urbanist font-semibold text-center mt-4">
              Please change your dapp browser to Binance Smart Chain Testnet to
              continue.
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => changeToBSCChain()}
                className="mt-[36px] bg-[#30DB9E] rounded-full text-[14px] font-[urbanist] py-2 px-[36px] text-[#134757] font-semibold"
              >
                Switch to BSC Testnet
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Header component for mobile and desktop device */}
      <div
        className={cn(
          'md:bg-transparency absolute top-0 w-full z-50 transition-all transition-slowest',
          isMenuOpen
            ? 'h-[100vh] md:h-[100px] menu-mobile-background'
            : 'h-[80px]'
        )}
      >
        <div className="flex py-[20px] px-7 md:px-[48px] justify-between items-center">
          {/* Only showing for the desktop device */}
          <div
            href="/"
            className="hidden lg:flex text-[#1EEFA4] items-center cursor-pointer visited:text-[#1EEFA4]"
          >
            <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
            <div className="hidden lg:block font-semibold text-[18px] ml-[31px]">
              <img src={LogoText} />
            </div>
          </div>
          <div className="hidden md:flex items-center lg:hidden">
            <HamburgerIcon className="text-[#1EEFA4] mr-5" />
            <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
          </div>

          {/* Only show for the mobile device */}
          <div className="block md:hidden cursor-pointer" onClick={menuOpen}>
            {/* <SmallLogoIcon size={40} className="text-[#1EEFA4]" /> */}
            {isMenuOpen ? (
              <div className="flex items-center">
                <HamburgerIcon className="text-[#1EEFA4] mr-5" />
                <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
                <div className="font-semibold text-[18px] ml-5">
                  <img src={LogoText} />
                </div>
              </div>
            ) : (
              <HamburgerIcon className="text-[#1EEFA4] font-semibold" />
            )}
          </div>
          {!isMenuOpen && (
            <div className="relative">
              {!isSafeApp && (
                <div className="mt-0 w-full md:w-auto flex items-center">
                  {location.pathname !== '/' && (
                    <Search
                      className="mr-4 xl:w-[400px]"
                      errorShowing={false}
                      isShowSearchBtn={false}
                    />
                  )}

                  <div className="hidden md:block">
                    <NoAccountsDefault
                      onClick={connectProvider}
                      loadingWallet={loadingWallet}
                      buttonText={isReadOnly ? t('c.connect') : network}
                      isReadOnly={isReadOnly}
                    />
                  </div>

                  {accounts && accounts[0] && !isReadOnly && (
                    <button
                      className="flex items-center ml-4 cursor-pointer"
                      onClick={() => {
                        if (windowDimenion.winWidth > 768) {
                          showAvatarPopup()
                        }
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
                        <div className="w-[44px] h-[44px]">
                          <UnstyledBlockies
                            className="rounded-full w-full h-full"
                            address={accounts[0]}
                            imageSize={45}
                          />
                        </div>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* DropdownMenu for the avatar popup */}
              {accounts && accounts[0] && avatarPopup && (
                <div className="absolute w-[266px] h-auto bg-[#0E4549] right-0 top-[60px] rounded-[24px] p-4 z-[100]">
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
                        <div className="w-[64px] h-[64px]">
                          <UnstyledBlockies
                            className="rounded-full w-full h-full"
                            address={accounts[0]}
                            imageSize={64}
                          />
                        </div>
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
          )}
        </div>

        <div
          className={cn('md:hidden', isMenuOpen ? 'block mx-7 mt-3' : 'hidden')}
        >
          <ProfileCard
            className="mb-4"
            account={accounts?.[0]}
            isReadOnly={isReadOnly}
            networkId={networkId}
          />
        </div>
        {isMenuOpen && windowDimenion.winWidth < 768 && (
          <div className="px-7 border-t border-[rgba(204,252,255,0.2)]">
            <DomainList
              className="mt-4 h-full flex flex-col"
              domainsList={domains}
              clickHandle={selectDomain}
              selectedDomain={selectedDomain}
            />
          </div>
        )}

        {isMenuOpen && (
          <div className="w-[100vw] block md:hidden">
            {isReadOnly ? (
              <div className="w-full flex justify-center absolute bottom-7">
                <button
                  className="flex items-center bg-[#1EEFA4] text-[#134757] text-[20px] px-[82px] py-3 text-[20px] rounded-[16px] font-semibold"
                  onClick={connectProvider}
                >
                  Connect{' '}
                  {loadingWallet && (
                    <div className="ml-2">
                      <AnimationSpin />
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="absolute bottom-7 w-[100vw] px-[87px]">
                <div className="w-full">
                  <button className="block text-white bg-[rgba(14,165,156,0.5)] w-full py-[7px] text-[20px] font-semibold rounded-[16px]">
                    {network}
                  </button>
                  <button className="bg-[#1EEFA4] rounded-[16px] w-full py-[7px] mt-4 ">
                    <div
                      className="text-[20px] font-semibold text-[#134757]"
                      onClick={disconnectProvider}
                    >
                      Disconnect
                    </div>
                    <div className="text-[18px] text-[#134757]">
                      {displayName}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer component in the home page */}
      <div className="h-[44px] flex py-[20px]  md:px-[64px] xl:px-[48px] justify-center md:justify-between absolute left-0 bottom-0 items-center w-full bg-[#071A2F]">
        <a className="hidden md:block" href="https://space.id">
          <div className="text-[#1EEFA4] text-[16px]">About SPACE ID</div>
        </a>
        <div className="flex items-center">
          <a target="_blank" href="https://twitter.com/SpaceIDProtocol">
            <TwitterIcon className="mr-2 text-[#30DB9E]" />
          </a>
          <a target="_blank" href="https://discord.com/invite/2qrrf79K2A">
            <DiscordIcon className="mr-2 text-[#30DB9E]" />
          </a>
          <a target="_blank" href="https://medium.com/@SpaceID">
            <RoundedIcon />
          </a>
        </div>
      </div>

      {children}
    </section>
  )
}
