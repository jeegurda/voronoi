import { useEffect, useState } from 'react'
import { IPlot, Point } from '../types'
import * as S from './ui.styled'
import { te } from '../utils'
import { useSelector } from 'react-redux'
import { selectUi, updateRedrawUi } from './store'
import { UI_PTS_LIMIT } from '../params'

interface IUIProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

const UI = ({ plotRef }: IUIProps) => {
  const [localPts, setLocalPts] = useState<Point[]>([])

  const redrawUi = useSelector(updateRedrawUi)
  const ui = useSelector(selectUi)

  useEffect(() => {
    const plot = plotRef.current
    if (plot === null) {
      // Not initialized yet
      return
    }

    setLocalPts(plot.props.pts)
  }, [redrawUi])

  const [hovered, setHovered] = useState<null | number>(null)

  const handleEnter = (idx: number) => {
    setHovered(idx)
  }

  const handleLeave = () => {
    setHovered(null)
  }

  const shouldRender = ui.display && localPts.length < UI_PTS_LIMIT

  return (
    <S.Container>
      {shouldRender &&
        localPts.map(([x, y], idx) => (
          <S.Point
            key={idx}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onMouseEnter={() => handleEnter(idx)}
            onMouseLeave={() => handleLeave()}
          >
            <S.Inner>
              {hovered === idx && <S.Index>{`${x},${y} (${idx})`}</S.Index>}
            </S.Inner>
          </S.Point>
        ))}
    </S.Container>
  )
}

export { UI }
