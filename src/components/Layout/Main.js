import React from 'react'
import styled from '@emotion/styled/macro'

import mq from 'mediaQuery'
import { hasNonAscii } from '../../utils/utils'

const MainContainer = styled('main')`
  width: 100%;
  padding: 20px 100px 0px 30px;
  @media (max-width: 768px) {
    padding: 50px 30px 0px 30px;
  }
`

const Main = ({ children }) => (
  <MainContainer hasNonAscii={hasNonAscii()}>{children}</MainContainer>
)

export default Main
