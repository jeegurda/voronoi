import styled, { createGlobalStyle } from 'styled-components'

export const Global = createGlobalStyle`
  body {
    margin: 0;
    background: #1e1e1e;
    color: rgba(255, 255, 255, 0.9);
    font: 15px sans-serif;
  }
`

export const Root = styled.div``

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid: auto / 1fr 250px;
`
