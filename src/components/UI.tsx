import { useState } from 'react'
import { IPlot, Point } from '../types'
import * as S from './ui.styled'

interface IUIProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

const UI = ({ plotRef }: IUIProps) => {
  const [localPts, setLocalPts] = useState<Point[]>([])

  return <S.Container></S.Container>
}

export { UI }
