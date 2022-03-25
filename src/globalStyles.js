import { injectGlobal } from 'emotion'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Overpass;
    background: #F0F6FA;
    margin: 0;
  }

  a {
    color: #18E199;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: #379070;
    }

    &:visited {
      color: #379070
    } 
  }
`
