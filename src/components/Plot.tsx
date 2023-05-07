import { useEffect, useRef } from 'react'
import { IPlot, IProps } from '../types'
import * as S from './plot.styled'
import { te } from '../utils'
import { createPlot } from '../diagram'
import { useDispatch, useSelector } from 'react-redux'
import { selectSettings, selectStyle, setCR, setRR } from './store'
import { UI } from './UI'

interface IPlotProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

export const Plot: React.FunctionComponent<IPlotProps> = ({ plotRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dispatch = useDispatch()
  const style = useSelector(selectStyle)
  const settings = useSelector(selectSettings)

  const handleResize = ({
    ctx,
    props,
  }: {
    ctx: CanvasRenderingContext2D
    props: IProps
  }) => {
    dispatch(setCR(`${props.width}x${props.height}`))
    dispatch(setRR(`${ctx.canvas.width}x${ctx.canvas.height}`))
  }

  useEffect(() => {
    if (plotRef.current) {
      console.warn('Plot already created')
    }

    const cnv = canvasRef.current ?? te('no canvas ref')
    const ctx = cnv.getContext('2d') ?? te('context died')

    plotRef.current = createPlot({
      ctx,
      cbs: {
        resize: handleResize,
      },
      initialSettings: settings,
      initialStyle: style,
    })
  }, [])

  return (
    <S.Container>
      <canvas ref={canvasRef}>plot</canvas>
      <UI plotRef={plotRef} />
    </S.Container>
  )
}
