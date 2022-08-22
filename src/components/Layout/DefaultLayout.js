import React, { Fragment } from 'react'

import Header from '../Header/Header'
import Container from './Container'
import SideNav from '../SideNav/SideNav'
import Main from './Main'

import styled from '@emotion/styled/macro'

import bg from '../../assets/bg-page.png'

const DefaultLayoutContainer = styled('nav')`
  background-color: #ecf3f1;
  background-image: url(${bg});
  min-height: 100vh;
`

const DefaultLayout = ({ children }) => (
  <DefaultLayoutContainer>
    <Header />
    <Container>
      <SideNav />
      <Main>{children}</Main>
    </Container>
  </DefaultLayoutContainer>
)

export default DefaultLayout
