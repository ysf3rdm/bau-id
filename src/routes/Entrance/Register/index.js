// Import Packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getAccounts, setUser } from 'app/slices/accountSlice'

export default function Register() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwdagain, setPwdAgain] = useState('')
  const [loading, setLoading] = useState(false)
  const accounts = useSelector((state) => state.account.accounts)
  const user = useSelector((state) => state.account.user)

  const history = useHistory()
  const dispatch = useDispatch()

  const moveToLogin = () => {
    history.push('/login')
  }

  // useEffect(() => {
  //   console.log(user)
  // }, [user])
  /* //TODO wallet address */
  const register = async (event) => {
    setLoading(true)
    event.preventDefault()
    var data = {
      email: email,
      password: pwd,
      walletAddress: accounts[0],
    }
    axios
      .post('https://localhost:44368/api/auth/register', data)
      .then((response) => {
        console.log(response)
        if (response.data.success) {
          var userRegistered = {
            userId: response.data.data.userId,
            email: response.data.data.email,
          }
          dispatch(setUser(userRegistered))
          history.push('/auth')
        }
      })
      .catch((error) => {
        console.log(error.response)
      })
    setLoading(false)
  }

  return (
    <div style={{ margin: 'auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '15px' }}>Register Page</h1>
      <div
        className=""
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <input
          className="s-input"
          style={{ width: '350px', marginBottom: '10px', fontSize: '18px' }}
          value={email}
          type="email"
          placeholder="enter your bau email address"
          onChange={(event) => {
            setEmail(event.target.value)
          }}
        ></input>
        <input
          className="s-input"
          style={{ marginBottom: '10px', fontSize: '18px' }}
          value={pwd}
          type="password"
          placeholder="enter password"
          onChange={(event) => {
            setPwd(event.target.value)
          }}
        ></input>
        <input
          className="s-input"
          style={{ marginBottom: '25px', fontSize: '18px' }}
          value={pwdagain}
          type="password"
          placeholder="enter password again"
          onChange={(event) => {
            setPwdAgain(event.target.value)
          }}
        ></input>
        {accounts && accounts[0] ? (
          <button
            className="text-darkButton bg-primary text-semibold text-[14px] font-semibold font-urbanist py-1 px-6 rounded-[10px]"
            type="submit"
            style={{ width: '130px' }}
            onClick={register}
          >
            Register
          </button>
        ) : (
          <div>
            <h1>You need to connect Metamask first.</h1>
          </div>
        )}

        <p style={{ marginTop: '20px' }}>
          if you have already an account,
          <a onClick={moveToLogin} style={{ cursor: 'pointer' }}>
            {' '}
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
