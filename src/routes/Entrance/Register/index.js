// Import Packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

export default function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwdagain, setPwdAgain] = useState('')

  const history = useHistory()

  useEffect(() => {
    console.log(email)
  }, [1000])

  const moveToLogin = () => {
    history.push('/login')
  }

  return (
    <div style={{ margin: 'auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '15px' }}>
        {' '}
        Register Page{' '}
      </h1>
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
        <button
          className="text-darkButton bg-primary text-semibold text-[14px] font-semibold font-urbanist py-1 px-6 rounded-[10px]"
          type="submit"
          style={{ width: '130px' }}
        >
          Register
        </button>
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
