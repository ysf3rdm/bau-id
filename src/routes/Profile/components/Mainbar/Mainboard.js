import React from 'react'
import { useSelector } from 'react-redux'

import { Address } from 'components/Addresses'

import EmailImg from 'assets/images/profile/email.png'
import WebsiteImg from 'assets/images/profile/website.png'
import AvatarImg from 'assets/images/profile/avatar.png'
import DescriptionImg from 'assets/images/profile/description.png'
import TwitterImg from 'assets/images/profile/twitter.png'
import DiscordImg from 'assets/images/profile/discord.png'
import GithubImg from 'assets/images/profile/github.png'
import TelegramImg from 'assets/images/profile/telegram.png'

import { toggleEditMode } from 'app/slices/accountSlice'

import EVMImg from 'assets/images/profile/evm.png'
import BTCImg from 'assets/images/profile/btc.png'
import LTCImg from 'assets/images/profile/ltc.png'
import { AddNewButton } from 'components/Button'

const haveAddresses = true
const haveProfile = true

const profileData = [
  {
    id: 1,
    title: 'Email',
    description: 'example@email.com',
    imageUrl: EmailImg,
    bgColorClass: 'bg-[rgba(50,126,164,0.6)]'
  },
  {
    id: 2,
    title: 'Website',
    description: 'example.example',
    imageUrl: WebsiteImg,
    bgColorClass: 'bg-[rgba(49,133,114,0.6)]'
  },
  {
    id: 3,
    title: 'Avatar',
    description: 'example.example',
    imageUrl: AvatarImg,
    bgColorClass: 'bg-[rgba(19,124,120,0.6)]'
  },
  {
    id: 4,
    title: 'Description',
    description: 'pepe is legendary',
    imageUrl: DescriptionImg,
    bgColorClass: 'bg-[rgba(204,252,255,0.2)]'
  },
  {
    id: 5,
    title: 'Twitter',
    description: 'pepefrog',
    imageUrl: TwitterImg,
    bgColorClass: 'bg-[rgba(65,152,208,0.6)]'
  },
  {
    id: 6,
    title: 'Discord',
    description: 'pepefrog#1234',
    imageUrl: DiscordImg,
    bgColorClass: 'bg-[rgba(88,98,192,0.6)]'
  },
  {
    id: 7,
    title: 'Github',
    description: 'example.example',
    imageUrl: GithubImg,
    bgColorClass: 'bg-[rgba(93,111,126,0.6)]'
  },
  {
    id: 8,
    title: 'Telegram',
    description: 'pepefrog',
    imageUrl: TelegramImg,
    bgColorClass: 'bg-[rgba(62,137,173,0.6)]'
  }
]

const addressesData = [
  {
    id: 1,
    title: 'EVM',
    description: '0x0000......000000',
    imageUrl: EVMImg,
    bgColorClass: 'bg-[rgba(89,128,201,0.6)]'
  },
  {
    id: 1,
    title: 'BTC',
    description: '3FZbgi......tktZc5',
    imageUrl: BTCImg,
    bgColorClass: 'bg-[rgba(167,129,80,0.6)]'
  },
  {
    id: 1,
    title: 'LTC',
    description: 'MGxNPP......2465zN',
    imageUrl: BTCImg,
    bgColorClass: 'bg-[rgba(99,124,165,0.6)]'
  }
]

export default function Mainboard() {
  const editOn = useSelector(state => state.account.profileEditMode)

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] xl:h-[calc(100%-200px)] mt-[14px] py-4 px-[22px]">
      {/* Addresses panel */}
      <div id="address">
        <p className="text-center text-white font-semibold text-[18px] font-urbanist mb-3">
          Addresses
        </p>
        {haveAddresses ? (
          <div className="grid grid-cols-2 1200px:grid-cols-3 gap-x-4 gap-y-3">
            {addressesData.map((data, index) => (
              <Address
                title={data.title}
                description={data.description}
                imageUrl={data.imageUrl}
                bgColorClass={data.bgColorClass}
                canEdit={editOn}
              />
            ))}
            {editOn && <AddNewButton />}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-[4]">
            <div className="bg-[rgba(204,252,255,0.2)] rounded-[28px] w-[300px] h-[56px] justify-center items-center flex text-white font-urbanist font-semibold text-[16px]">
              Nothing here:(
            </div>
          </div>
        )}
      </div>
      {/* Profile panel */}
      <div id="profile" className="mt-3">
        <p className="text-center text-white font-semibold text-[18px] font-urbanist mb-3">
          Profile
        </p>
        {haveProfile ? (
          <div className="grid grid-cols-2 1200px:grid-cols-3 gap-x-4 gap-y-3">
            {profileData.map((data, index) => (
              <Address
                title={data.title}
                description={data.description}
                imageUrl={data.imageUrl}
                bgColorClass={data.bgColorClass}
                canEdit={editOn}
              />
            ))}
            {editOn && <AddNewButton />}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-[4]">
            <div className="bg-[rgba(204,252,255,0.2)] rounded-[28px] w-[300px] h-[56px] justify-center items-center flex text-white font-urbanist font-semibold text-[16px]">
              Nothing here:(
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
