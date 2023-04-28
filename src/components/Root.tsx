import { useEffect, useRef } from 'react'
import { Plot } from './Plot'
import * as S from './root.styled'
import { IPlot } from '../types'
import { UI } from './UI'
import { te } from '../utils'
import { Provider, useSelector } from 'react-redux'
import { selectCR, store } from './store'

export const Root = () => {
  const plotRef = useRef<IPlot | null>(null)

  useEffect(() => {
    return () => {
      const plot = plotRef.current ?? te('Ref is empty')

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
          <UI plotRef={plotRef} />
        </S.Container>
      </S.Root>
    </Provider>
  )
}
