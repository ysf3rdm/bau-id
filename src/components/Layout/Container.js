import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

const Container = styled('div')`
  padding: 0;
  margin: 0 auto 0;
  background-image: url('../../assets/baseBG.png');
  background-size: 100%;
  ${mq.medium`
    background-image: url("../../assets/baseBG.png");
    padding: 0 100px 0 40px;
  `}
`

export default Container
