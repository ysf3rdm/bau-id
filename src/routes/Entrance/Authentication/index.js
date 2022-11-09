// Import Packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import ReactInputVerificationCode from 'react-input-verification-code'
import { response } from 'msw'
import { setUser } from 'app/slices/accountSlice'

export default function Auth({ props }) {
  const [code, setCode] = useState('')

  const user = useSelector((state) => state.account.user)

  console.log(user)

  const sendActivationCode = (e) => {
    e.preventDefault()
    if (!code.includes('-')) {
      console.log(code)
      var form_data = new FormData()
      form_data.append('secretKey', code)
      form_data.append('userId', user)
      axios
        .post('https://localhost:5001/api/auth/verifykey', form_data)
        .then((response) => {
          useDispatch(setUser({}))
          history.pushState('/login')
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      console.error('sayı tam yazılmamış')
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center text-center">
        <form autoComplete="off" onSubmit={sendActivationCode}>
          <h1
            className="text-green-100 mb-10"
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            ENTER YOUR 6 DIGIT CODE
          </h1>
          <ReactInputVerificationCode
            value={code}
            length={6}
            onChange={setCode}
            placeholder="-"
            type="submit"
            autoFocus={true}
            autocomplete="off"
          />
          <button
            type="submit"
            className="px-5 py-2 text-xl font-semibold bg-green-100 text-dark-100 rounded-2xl mt-10 align-items-center"
          >
            Send
          </button>
        </form>
      </div>
    </>
  )
}
