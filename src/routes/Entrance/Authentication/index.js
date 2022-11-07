// Import Packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import ReactInputVerificationCode from 'react-input-verification-code'

export default function Auth() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center text-center">
        <form autoComplete="off">
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
            length={6}
            placeholder="."
            type="text"
            autoFocus={true}
            autocomplete="off"
          />
          <button className="px-5 py-2 text-xl font-semibold bg-green-100 text-dark-100 rounded-2xl mt-10 align-items-center">
            Send
          </button>
        </form>
      </div>
    </>
  )
}
