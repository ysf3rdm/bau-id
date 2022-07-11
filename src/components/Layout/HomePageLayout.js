// Import packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { getNetworkId } from '@siddomains/ui'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import ClickAwayListener from 'react-click-away-listener'

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
import { setAllDomains, setSelectedDomain } from 'app/slices/domainSlice'

// Import redux assets
import { getAccounts, getHomeData } from 'app/slices/accountSlice'
import { toggleDrawer, toggleNetworkError } from 'app/slices/uiSlice'

// Import assets
import bg from 'assets/heroBG.jpg'

// Import custom functions
import { connectProvider, disconnectProvider } from 'utils/providerUtils'
import { EMPTY_ADDRESS } from 'utils/records'
import { GET_ERRORS } from 'graphql/queries'

//Import Assets
import LogoText from '../../assets/images/space-logo-text.png'
import SearchIcon from '../Icons/SearchIcon'

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [avatarPopup, setAvatarPopup] = useState(false)
  const [networkId, setNetworkID] = useState('')

  const domains = useSelector(state => state.domain.domains)
  const showNetworkErrorModal = useSelector(
    state => state.ui.isShowNetworkErrorModal
  )
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
    if (!isMenuOpen) {
      setSearchOpen(false)
    }
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isReadOnly) {
      dispatch(setAllDomains([]))
    }
  }, [isReadOnly])

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
    if (windowDimenion.winWidth < 768) {
      history.push('/profile')
      setIsMenuOpen(false)
    }
  }

  const changeToBSCChain = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }]
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                rpcUrls: [
                  'https://bsc-testnet.nodereal.io/v1/c9bc598b84b14e62b11c0a1b74b37cbd'
                ]
              }
            ]
          })
        } catch (addError) {
          console.log()
        }
      }
    }
    window.location.reload()
  }

  const moveToProfile = () => {
    history.push('/profile')
  }

  const showDrawer = () => {
    console.log('clicked')
    dispatch(toggleDrawer(true))
  }

  const disconnect = () => {
    disconnectProvider()
  }

  const closeModal = () => {
    dispatch(toggleNetworkError(false))
  }

  return (
    <section
      style={{ background: `url(${bg})` }}
      className="bg-cover relative min-h-[100vh] flex items-center justify-center"
    >
      {showNetworkErrorModal && (
        <Modal
          cannotCloseFromOutside={false}
          width="574px"
          className="pt-6 pb-[36px] px-[24px]"
          showingCrossIcon={true}
          closeModal={closeModal}
        >
          <div className="text-[white]">
            <div className="text-[20px] md:text-[28px] font-cocoSharp text-center font-bold">
              Unsupported Network
            </div>
            <div className="text-urbanist font-semibold text-center mt-4">
              Please change your dapp browser to Binance Smart Chain Testnet to
              continue.
            </div>
            <div className="justify-center hidden md:flex">
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
          'md:bg-transparency absolute top-0 w-full z-50',
          isMenuOpen
            ? 'min-h-[100vh] h-full md:h-[100px] md:min-h-[100px] menu-mobile-background'
            : searchOpen
            ? 'min-h-auto h-auto md:h-[100px] md:min-h-[100px] menu-mobile-background rounded-b-[24px]'
            : 'h-[80px]'
        )}
      >
        <div className="flex py-[20px] px-7 md:px-[48px] justify-between items-center">
          {/* Only showing for the desktop device */}
          <a
            href="/"
            className="hidden lg:flex text-[#1EEFA4] items-center cursor-pointer visited:text-[#1EEFA4]"
          >
            <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
            <div className="hidden lg:block font-semibold text-[18px] ml-[31px]">
              <img src={LogoText} />
            </div>
          </a>

          <div className="hidden md:flex items-center lg:hidden">
            <div onClick={showDrawer}>
              <HamburgerIcon className="text-[#1EEFA4] mr-5" />
            </div>
            <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
          </div>

          {/* Only show for the mobile device */}
          <div className="block md:hidden cursor-pointer w-full justify-between">
            {/* <SmallLogoIcon size={40} className="text-[#1EEFA4]" /> */}
            {isMenuOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div onClick={menuOpen}>
                    <HamburgerIcon className="text-[#1EEFA4] mr-5" />
                  </div>
                  <a href="/">
                    <div className="flex items-center">
                      <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
                    </div>
                  </a>
                </div>
                <div className="">
                  <button
                    className="flex items-center bg-[#1EEFA4] text-[#134757] text-[20px] px-5 py-2 text-[20px] rounded-[16px] font-semibold"
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
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <div onClick={menuOpen} className="mr-5">
                    <HamburgerIcon className="text-[#1EEFA4] font-semibold" />
                  </div>
                  <a href="/">
                    <div className="flex items-center">
                      <SmallLogoIcon size={40} className="text-[#1EEFA4]" />
                    </div>
                  </a>
                </div>
                <div className="block md:hidden">
                  {isReadOnly && (
                    <div className="">
                      <button
                        className="flex items-center bg-[#1EEFA4] text-[#134757] text-[20px] px-5 py-2 text-[20px] rounded-[16px] font-semibold"
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
                  )}
                </div>
              </div>
            )}
          </div>

          {!isMenuOpen && (
            <div className="relative">
              {!isSafeApp && (
                <div className="mt-0 w-full md:w-auto flex items-center">
                  {location.pathname !== '/' && (
                    <Search
                      className="mr-4 xl:w-[400px] hidden md:block"
                      errorShowing={true}
                      isShowSearchBtn={true}
                      errorsStyling={true}
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
                    <div className="flex items-center">
                      <div
                        className="block md:hidden"
                        onClick={() => setSearchOpen(!searchOpen)}
                      >
                        <SearchIcon className="text-[rgba(204,252,255,0.6)] cursor-pointer" />
                      </div>

                      <button
                        className="flex items-center ml-4 cursor-pointer"
                        onClick={() => {
                          // if (windowDimenion.winWidth > 768) {
                          showAvatarPopup()
                          // }
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
                    </div>
                  )}
                </div>
              )}

              {/* DropdownMenu for the avatar popup */}
              {accounts && accounts[0] && avatarPopup && (
                <ClickAwayListener
                  onClickAway={() => {
                    setAvatarPopup(false)
                  }}
                >
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
                        className="hidden md:block font-semibold h-[40px] flex items-center justify-center cursor-pointer hover:bg-[#1C585A] hover:rounded-[12px]"
                        onClick={moveToProfile}
                      >
                        Manage Account
                      </div>
                      <div
                        className="h-[40px] flex items-center justify-center cursor-pointer bg-[rgba(67,140,136,0.25)] rounded-[12px] md:bg-transparent hover:bg-[#1C585A] hover:rounded-[12px]"
                        onClick={disconnectProvider}
                      >
                        Disconnect
                      </div>
                    </div>
                  </div>
                </ClickAwayListener>
              )}
            </div>
          )}
        </div>

        {searchOpen && (
          <div className="px-7 py-3 pb-7">
            <Search
              className="mx-auto"
              errorShowing={true}
              isShowSearchBtn={true}
              errorsStyling={false}
              suggestionClassName="w-full"
              isAbsolutePosition={false}
              onSubmit={() => {
                setSearchOpen(false)
              }}
            />
          </div>
        )}

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
        {!isReadOnly && isMenuOpen && windowDimenion.winWidth < 768 && (
          <div className="px-7 border-t border-[rgba(204,252,255,0.2)] h-[calc(100vh-250px)]">
            <DomainList
              className="mt-4 h-full flex flex-col"
              domainsList={domains}
              clickHandle={selectDomain}
              selectedDomain={selectedDomain}
            />
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
