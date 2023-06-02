import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
`

export const Point = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
`

export const Inner = styled.span`
  width: 16px;
  height: 16px;
  left: -8px;
  top: -8px;
  position: absolute;
  cursor: grab;
`

export const Index = styled.span`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 20px);
  white-space: nowrap;
  font-size: 14px;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 1);
`
