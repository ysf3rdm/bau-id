import React, { lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { validateName } from '@siddomains/sidjs/dist/utils'

import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { useAccount } from './components/QueryAccount'
import { emptyAddress } from './ui'
import ToastContainer from 'components/Toast/ToastContainer'

import { setInviter } from 'app/slices/referralSlice'

const INVITER_KEY = 'inviter'

import { useJwt } from 'react-jwt'

const Home = lazy(() => import('./routes/Home'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Profile = lazy(() => import('./routes/Profile'))
const HomePageLayout = lazy(() => import('components/Layout/HomePageLayout'))
const Error404 = lazy(() => import('components/Error/Errors'))
const LoginPage = lazy(() => import('./routes/Entrance/Login'))
const RegisterPage = lazy(() => import('./routes/Entrance/Register'))
const AuthPage = lazy(() => import('./routes/Entrance/Authentication'))

const Route = ({
  component: Component,
  layout: Layout = HomePageLayout,
  ...rest
}) => {
  return (
    <DefaultRoute
      {...rest}
      render={(props) =>
        Layout ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

const App = () => {
  const { decodedToken, isExpired } = useJwt(localStorage.getItem('authToken'))

  useReactiveVarListeners()
  const account = useAccount()
  const accountRef = useRef(account)
  const dispatch = useDispatch()
  // const [showAlert, setShowAlert] = useState(true)
  useEffect(() => {
    if (
      accountRef.current !== emptyAddress &&
      account !== emptyAddress &&
      accountRef.current !== account
    ) {
      window.location.reload()
    } else {
      accountRef.current = account
    }
  }, [account])

  useEffect(() => {
    const params = new URL(window.location).searchParams
    let inviter =
      params.get('inviter')?.trim() ||
      window.sessionStorage.getItem(INVITER_KEY)
    if (inviter) {
      inviter = decodeURIComponent(inviter)
      if (inviter.endsWith('.bnb')) {
        try {
          inviter = validateName(inviter)
          dispatch(setInviter(inviter))
          window.sessionStorage.setItem(INVITER_KEY, inviter)
        } catch (e) {
          console.error('invalid inviter:', e)
        }
      }
    }
  }, [])

  return (
    <BrowserRouter basename="/">
      {/*<div*/}
      {/*  className="text-white text-base p-2 px-16 sm:px-7 font-bold break-all"*/}
      {/*  style={{*/}
      {/*    background: 'linear-gradient(90deg, #FF7A00 0%, #3300FF 100%)',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Oct 28th 12 AM — Nov 2nd 12 AM ET 👻 👻 👻 Limited Halloween Edition*/}
      {/*  skins through domain registration or extension. 🎃 🎃 🎃{' '}*/}
      {/*  <a*/}
      {/*    className="text-primary visited:text-primary"*/}
      {/*    href="https://blog.space.id/spooky-halloween-skins-are-in-your-area-4fc3fd98987d"*/}
      {/*    target="_blank"*/}
      {/*  >*/}
      {/*    Read more ↗*/}
      {/*  </a>*/}
      {/*<div className="flex-none" onClick={() => setShowAlert(false)}>*/}
      {/*  <CrossIcon className="text-white cursor-pointer" size={11} />*/}
      {/*</div>*/}
      {/*</div>*/}
      <Switch>
        <Route exact path="/" component={Home} layout={HomePageLayout} />
        <Route
          exact
          path="/profile"
          component={Profile}
          layout={HomePageLayout}
        />
        <Route
          path="/name/:name"
          component={SingleName}
          layout={HomePageLayout}
        />
        <Route path="/login" component={LoginPage} layout={HomePageLayout} />
        <Route
          path="/register"
          component={RegisterPage}
          layout={HomePageLayout}
        />
        <Route path="/auth" component={AuthPage} layout={HomePageLayout} />
        <Route path="*" component={Error404} layout={null} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  )
}
export default App
