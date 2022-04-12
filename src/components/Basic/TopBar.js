import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

const TopBar = styled('div')`
  margin-left: 27px;
  margin-right: 27px;
  padding: 23px 20px 16px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #5ed6ab;
  @media (max-width: 768px) {
    display: block;
    margin-left: 20px;
    margin-right: 20px;
    padding: 23px 0px 16px 0px;
  }
`

export default TopBar
