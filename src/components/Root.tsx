import { useEffect, useRef } from 'react'
import { Plot } from './Plot'
import * as S from './root.styled'
import { IPlot } from '../types'
import { Controls } from './Controls'
import { getPlot } from '../utils'
import { Provider } from 'react-redux'
import { store } from './store'

export const Root = () => {
  const plotRef = useRef<IPlot | null>(null)

  useEffect(() => {
    return () => {
      const plot = getPlot(plotRef)

      plot.destroy()
      plotRef.current = null
    }
  }, [])

  return (
    <Provider store={store}>
      <S.Root>
        <S.Global />
        <S.Container>
          <Plot plotRef={plotRef} />
          <Controls plotRef={plotRef} />
        </S.Container>
      </S.Root>
    </Provider>
  )
}
