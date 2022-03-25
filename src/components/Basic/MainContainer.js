import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

const MainContainer = styled('div')`
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
  background: #f0f7f4;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.07);
  border-radius: 20px;

  ${mq.small`
    border-radius: 6px;
  `}
`

export default MainContainer
