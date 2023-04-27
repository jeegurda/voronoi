import { useEffect, useRef } from 'react'
import { IPlot } from '../types'
import * as S from './plot.styled'
import { te } from '../utils'
import { createPlot } from '../diagram'

interface IProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

export const Plot: React.FunctionComponent<IProps> = ({ plotRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (plotRef.current) {
      console.warn('Plot already created')
    }

    const cnv = canvasRef.current ?? te('no canvas ref')
    const ctx = cnv.getContext('2d') ?? te('context died')

    plotRef.current = createPlot({ ctx })

    plotRef.current.draw()
  }, [])

  return (
    <S.Container>
      <canvas ref={canvasRef}>plot</canvas>
    </S.Container>
  )
}
