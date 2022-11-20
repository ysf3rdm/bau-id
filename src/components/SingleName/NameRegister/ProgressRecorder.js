import crypto from 'crypto'
import moment from 'moment'
import { RegisterState } from './constant'

function randomSecret() {
  return '0x' + crypto.randomBytes(32).toString('hex')
}
window.localStorage.removeItem('progress')
const storeKey = 'spaceIdProgress'
const Store = {
  get: (label) => {
    return window.localStorage.getItem(storeKey)
      ? JSON.parse(window.localStorage.getItem(storeKey))[label]
      : null
  },
  set: (label, obj) => {
    let data = {}
    let progress
    if ((progress = window.localStorage.getItem(storeKey))) {
      data = JSON.parse(progress)
    }
    data[label] = {
      ...data[label],
      ...obj,
    }
    window.localStorage.setItem(storeKey, JSON.stringify(data))
  },
  remove: (label) => {
    let data = {}
    let progress
    if ((progress = window.localStorage.getItem(storeKey))) {
      data = JSON.parse(progress)
    }
    delete data[label]
    window.localStorage.setItem(storeKey, JSON.stringify(data))
  },
}

const ProgressRecorder = ({
  checkCommitment,
  domain,
  networkId,
  states,
  step,
  dispatch,
  secret,
  setSecret,
  years,
  setYears,
  timerRunning,
  setTimerRunning,
  waitUntil,
  setWaitUntil,
  secondsPassed,
  setSecondsPassed,
  commitmentExpirationDate,
  setCommitmentExpirationDate,
  now,
  usePoint,
  setUsePoint,
  inviter,
  savedInviter,
  setSavedInviter,
}) => {
  const stepIndex = Object.keys(states).indexOf(step)
  const label = `${networkId}-${domain.label}`
  let savedStepIndex = 0
  let savedStep, isBehind
  savedStep = Store.get(label)
  if (!secret) {
    if (savedStep && savedStep.secret) {
      setSecret(savedStep.secret)
    } else {
      setSecret(randomSecret())
    }
  }
  if (!years) {
    if (savedStep && savedStep.years) {
      setYears(savedStep.years)
    } else {
      setYears(1)
    }
  }
  if (!waitUntil) {
    if (savedStep && savedStep.waitUntil) {
      setWaitUntil(savedStep.waitUntil)
    }
  }
  if (!secondsPassed) {
    if (savedStep && savedStep.secondsPassed) {
      setSecondsPassed(savedStep.secondsPassed)
    }
  }
  if (!commitmentExpirationDate) {
    if (savedStep && savedStep.commitmentExpirationDate) {
      setCommitmentExpirationDate(savedStep.commitmentExpirationDate)
    }
  }

  savedStepIndex = Object.keys(states).indexOf(savedStep && savedStep.step)
  isBehind = savedStepIndex - stepIndex > 0

  if (savedStep && now) {
    if (
      savedStep.commitmentExpirationDate &&
      moment(savedStep.commitmentExpirationDate).isSameOrBefore(now)
    ) {
      Store.remove(label)
    } else if (isBehind) {
      // todo behind
    }
  }
  if (savedStep && usePoint === undefined && savedStep.usePoint !== undefined) {
    setUsePoint(savedStep.usePoint)
  }
  if (!savedInviter && savedStep && savedStep.inviter) {
    setSavedInviter(savedStep.inviter)
  }
  // todo change step
  switch (step) {
    case RegisterState.request: // init state
      if (!savedStep) {
        Store.set(label, { step, secret, usePoint })
      } else {
        if (!savedStep.secret || !savedStep.years) {
          Store.set(label, { step, secret, years, usePoint })
        } else {
          let commitmentDate = new Date(checkCommitment * 1000)

          if (savedStep.waitUntil > now) {
            const passed = Number(savedStep.secondsPassed)
            if (!Number.isNaN(passed) && passed >= 0 && passed <= 60) {
              dispatch(RegisterState.requestSuccess)
              setSecondsPassed(passed)
            }
          } else if (commitmentDate > 0) {
            // todo: expire?
            dispatch(RegisterState.confirm)
            // dispatch('NEXT') // Go to pending
            // dispatch('NEXT') // Go to confirmed
          } else {
            // This should be called only when user increament/decrement years
            Store.set(label, { step, secret, years, usePoint })
          }
        }
      }
      break
    case RegisterState.requestSuccess:
      Store.set(label, {
        step,
        secret,
        waitUntil,
        secondsPassed,
        commitmentExpirationDate,
        usePoint,
        inviter,
      })
      if (!timerRunning) {
        setTimerRunning(true)
      }
      break
    case RegisterState.confirm:
      if (timerRunning) {
        setTimerRunning(false)
      }
      break
  }
  return secret
}

export default ProgressRecorder
