import { useEffect, useState } from 'react'
import { IPlot, Point } from '../types'
import * as S from './ui.styled'
import { te } from '../utils'
import { useSelector } from 'react-redux'
import { updateRedrawUi } from './store'

interface IUIProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

const UI = ({ plotRef }: IUIProps) => {
  const [localPts, setLocalPts] = useState<Point[]>([])

  const redrawUi = useSelector(updateRedrawUi)

  useEffect(() => {
    const plot = plotRef.current
    if (plot === null) {
      // Not initialized yet
      console.log('initial?')
      return
    }

    setLocalPts(plot.props.pts)
  }, [redrawUi])

  return (
    <S.Container>
      {localPts.map(([x, y], idx) => (
        <S.Point
          key={idx}
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          {/* {idx} */}
        </S.Point>
      ))}
    </S.Container>
  )
}

export { UI }
