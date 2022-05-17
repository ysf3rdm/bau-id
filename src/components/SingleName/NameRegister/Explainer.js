import React from 'react'
import { useTranslation } from 'react-i18next'

import mq from 'mediaQuery'
import Step from './Step'
import { ReactComponent as Tick } from '../../Icons/GreyCircleTick.svg'

import { requestPermission, hasPermission } from './notification'

const Explainer = ({ step, waitPercentComplete, waitTime }) => {
  const { t } = useTranslation()
  const titles = {
    PRICE_DECISION: t('register.titles.0'),
    COMMIT_SENT: t('register.titles.1'),
    COMMIT_CONFIRMED: t('register.titles.1'),
    AWAITING_REGISTER: t('register.titles.1'),
    REVEAL_SENT: t('register.titles.1'),
    REVEAL_CONFIRMED: t('register.titles.2')
  }

  return (
    <>
      <div>
        <div>
          <h2 style={{ color: ' #379070' }}>{titles[step]}</h2>
          <p>{t('register.favourite')}</p>
        </div>
        {hasPermission() ? (
          <div>
            <Tick style={{ marginRight: 5 }} />
            {t('register.notify')}
          </div>
        ) : (
          <button type="hollow-primary" onClick={requestPermission}>
            {t('register.notify')}
          </button>
        )}
      </div>

      <section>
        <Step
          number={1}
          progress={
            step === 'PRICE_DECISION' ? 0 : step === 'COMMIT_SENT' ? 50 : 100
          }
          title={t('register.step1.title')}
          text={t('register.step1.text') + ' ' + t('register.step1.text2')}
          step={step}
        />
        <Step
          number={2}
          progress={
            step === 'PRICE_DECISION' || step === 'COMMIT_SENT'
              ? 0
              : step === 'COMMIT_CONFIRMED'
              ? waitPercentComplete
              : 100
          }
          title={
            t(
              'register.step2.title'
            ) /* `Wait for ${moment
            .duration({ seconds: waitTime })
            .humanize()}` //add back localization of moment*/
          }
          text={t('register.step2.text')}
          step={step}
        />
        <Step
          number={3}
          progress={
            step === 'REVEAL_CONFIRMED' ? 100 : step === 'REVEAL_SENT' ? 50 : 0
          }
          title={t('register.step3.title')}
          text={t('register.step3.text')}
          step={step}
        />
      </section>
    </>
  )
}

export default Explainer
