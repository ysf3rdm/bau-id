import React, { createRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

import { useOnClickOutside } from 'components/hooks'
import RotatingSmallCaret from '../Icons/RotatingSmallCaret'

import './LanguageSwitcher.scss'
import LanguageEarthIcon from 'components/Icons/LanguageEarthIcon'

const LANGUAGES = [
  {
    value: 'en',
    label: 'English (EN)'
  },
  {
    value: 'cn',
    label: '简体中文 (CN)'
  },
  {
    value: 'ja',
    label: '日本語 (JA)'
  },
  {
    value: 'de',
    label: 'Deutsch (DE)'
  },
  {
    value: 'es',
    label: 'Español (ES)'
  },
  {
    value: 'fr',
    label: 'Français (FR)'
  },
  {
    value: 'ko',
    label: '한국어 (KO)'
  },
  {
    value: 'it',
    label: 'Italiano (IT)'
  },
  {
    value: 'pl',
    label: 'Polski (PL)'
  },
  {
    value: 'pt-BR',
    label: 'Português (BR)'
  },
  {
    value: 'ru',
    label: 'Pусский (RU)'
  },
  {
    value: 'vi',
    label: 'Tiếng Việt (VI)'
  }
]

function getLang(lang) {
  return LANGUAGES.find(l => l.value === lang)
}

function saveLanguageToLocalStorage(value) {
  window.localStorage.setItem('language', value)
}

function getLanguageFromLocalStorage() {
  return window.localStorage.getItem('language')
}

export default function LanguageSwitcher() {
  const dropdownRef = createRef()
  const togglerRef = createRef()
  const [languageSelected, setLanguageSelected] = useState(
    getLang(getLanguageFromLocalStorage()) ?? getLang('en')
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const { i18n } = useTranslation()

  useOnClickOutside([dropdownRef, togglerRef], () => setShowDropdown(false))

  function changeLanguage(language) {
    setLanguageSelected(language)
    saveLanguageToLocalStorage(language.value)
    i18n.changeLanguage(language.value)
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <div
        className="text-[#adbbcd] uppercase flex justify-enter h-full py-0 px-[6px] items-center hover:cursor-pointer"
        ref={togglerRef}
        onClick={() => setShowDropdown(show => !show)}
      >
        <span className="mr-0 text-[#30DB9E] font-semibold font-urbanist text-[16px] mr-1">
          {languageSelected.value}
        </span>
        <LanguageEarthIcon />
        {/* <RotatingSmallCaret
          start="top"
          rotated={showDropdown ? 1 : 0}
          highlight={1}
        /> */}
      </div>
      {showDropdown && (
        <AnimatePresence>
          <motion.div
            className="absolute bg-[#071A2F] bottom-0 right-0 mt-[10px] rounded-[8px] shadow-dropdown w-[230px] z-[2] max-h-[180px] overflow-y-auto dropdown-container border border-[##1EEFA4]"
            ref={dropdownRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {LANGUAGES.map(language => {
              return (
                <li
                  key={language.value}
                  onClick={() => changeLanguage(language)}
                >
                  {language.label}
                  <div
                    className="rounded-[50%] bg-white w-[10px] h-[10px] shadow-ball"
                    style={{
                      background:
                        languageSelected.value === language.value
                          ? '#5284ff'
                          : 'inherit'
                    }}
                  />
                </li>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
