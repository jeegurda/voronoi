import styled, { createGlobalStyle } from 'styled-components'

export const Global = createGlobalStyle`
  body {
    margin: 0;
    background: #1e1e1e;
    color: rgba(255, 255, 255, 0.9);
  }
`

export const Root = styled.div`
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  display: flex;
`

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  flex: 1;
`
