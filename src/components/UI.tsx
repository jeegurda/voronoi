import { useDispatch, useSelector } from 'react-redux'
import * as S from './ui.styled'
import {
  selectCR,
  selectRR,
  selectSettings,
  selectStyle,
  setSettings,
  setStyle,
} from './store'
import { IMainState, IPlot } from '../types'
import * as React from 'react'
import { te } from '../utils'
import { useEffect } from 'react'

const stylesList: {
  title: string
  prop: keyof IMainState['style']
}[] = [
  { title: 'Delaunay triangulation', prop: 'dTriangulation' },
  { title: 'Triangulation circumcircles', prop: 'dCircumcircles' },
  { title: 'Diagram vertices', prop: 'vVertices' },
  { title: 'Diagram line segments', prop: 'vSegments' },
  { title: 'Diagram bounds', prop: 'vBounds' },
  { title: 'Diagram fill', prop: 'vFill' },
]

interface IUIProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

export const UI: React.FunctionComponent<IUIProps> = ({ plotRef }) => {
  const cr = useSelector(selectCR)
  const rr = useSelector(selectRR)
  const style = useSelector(selectStyle)
  const settings = useSelector(selectSettings)

  const dispatch = useDispatch()

  const handleChange = (
    prop: keyof IMainState['style'],
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setStyle({ prop, style: { display: evt.target.checked } }))
  }

  useEffect(() => {
    const plot = plotRef.current ?? te('Ref is null')

    plot.updateStyle(style)
    plot.draw()
  }, [style])

  const handleRandomize = () => {
    const plot = plotRef.current ?? te('Ref is null')

    plot.randomize()
    plot.draw()
  }

  const handleGenerateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)

    dispatch(setSettings({ generateAmount: value }))
  }

  useEffect(() => {
    const plot = plotRef.current ?? te('Ref is null')

    plot.updateSettings(settings)
    plot.draw()
  }, [settings])

  return (
    <S.Container>
      <S.Block>
        <div>Canvas res: {cr}</div>
        <div>Render res: {rr}</div>
      </S.Block>
      <S.Block>
        {stylesList.map(({ title, prop }, idx) => {
          const disabled = prop === 'vBounds' && !style.vSegments.display
          const checked = disabled ? false : style[prop].display

          return (
            <S.Section key={idx}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleChange(prop, e)}
                  disabled={disabled}
                />
                <span>{title}</span>
              </label>
            </S.Section>
          )
        })}
      </S.Block>
      <S.Block>
        <S.Title>Voronoi diagram points:</S.Title>

        <S.Section>
          <button onClick={handleRandomize}>Generate</button>
          <input
            type="number"
            min="1"
            max="100000"
            value={settings.generateAmount}
            onChange={handleGenerateChange}
          />
        </S.Section>
        <div>
          <button>Load from image</button>
        </div>
      </S.Block>
    </S.Container>
  )
}
