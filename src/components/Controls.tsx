import { useDispatch, useSelector } from 'react-redux'
import * as S from './controls.styled'
import {
  selectCR,
  selectRR,
  selectSettings,
  selectStyle,
  selectUi,
  setSettings,
  setStyle,
  setUi,
} from './store'
import { IMainState, IPlot, RootState } from '../types'
import * as React from 'react'
import { getPlot, te } from '../utils'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

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

interface IControlsProps {
  plotRef: React.MutableRefObject<IPlot | null>
}

export const Controls: React.FunctionComponent<IControlsProps> = ({
  plotRef,
}) => {
  const dispatch = useDispatch()

  const cr = useSelector(selectCR)
  const rr = useSelector(selectRR)
  const ui = useSelector(selectUi)
  const style = useSelector(selectStyle)
  const settings = useSelector(selectSettings)

  const [displaySettings, setDisplaySettings] = useState<{
    [key in keyof RootState['settings']]: string
  }>(() => ({
    generateAmount: String(settings.generateAmount),
    margin: String(settings.margin),
  }))
  const [reading, setReading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRefs: {
    [key in keyof RootState['settings']]: MutableRefObject<HTMLInputElement | null>
  } = {
    generateAmount: useRef<HTMLInputElement>(null),
    margin: useRef<HTMLInputElement>(null),
  }

  useEffect(() => {
    const plot = getPlot(plotRef)

    plot.updateStyle(style)
    plot.draw()
  }, [style])

  useEffect(() => {
    const plot = getPlot(plotRef)

    plot.updateSettings(settings)
    plot.draw()
  }, [settings])

  const handleStyleCheckboxChange = (
    prop: keyof IMainState['style'],
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setStyle({ prop, style: { display: evt.target.checked } }))
  }

  const handleGenerateClick = () => {
    const plot = getPlot(plotRef)

    plot.randomize()
    plot.draw()
  }

  const handleGenerateInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.validity.valid) {
      dispatch(setSettings({ generateAmount: evt.target.valueAsNumber }))
    }

    setDisplaySettings(({ generateAmount, ...rest }) => ({
      ...rest,
      generateAmount: evt.target.value,
    }))
  }

  const handleInputButton = () => {
    const fileInput = fileInputRef.current ?? te('File input ref empty')

    fileInput.click()
  }

  const handleMarginInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.validity.valid) {
      dispatch(setSettings({ margin: evt.target.valueAsNumber }))
    }

    setDisplaySettings(({ margin, ...rest }) => ({
      ...rest,
      margin: evt.target.value,
    }))
  }

  const handleFileInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const input = evt.target
    const files = input.files ?? te('No files')

    setReading(true)
    const [file] = files
    const fr = new FileReader()

    fr.addEventListener('load', () => {
      const result = fr.result

      if (typeof result !== 'string') {
        te('Error reading as base64')
      }

      const img = new Image()

      img.addEventListener('load', async () => {
        const bitmap = await createImageBitmap(img)
        const plot = getPlot(plotRef)

        plot.drawFromBitmap(bitmap)

        input.value = ''
        setReading(false)
      })
      img.src = result
    })
    fr.readAsDataURL(file)
  }

  const isOutOfBounds = useCallback(
    (prop: keyof RootState['settings']): boolean => {
      const ref = inputRefs[prop].current

      if (!ref) {
        // Refs not mounted yet
        return false
      }

      return !ref.validity.valid
    },
    [],
  )

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
                  onChange={(e) => handleStyleCheckboxChange(prop, e)}
                  disabled={disabled}
                />
                <span>{title}</span>
              </label>
            </S.Section>
          )
        })}
      </S.Block>
      <S.Block>
        <S.Section>
          <label>
            <input
              type="checkbox"
              checked={ui.display}
              onChange={(e) => dispatch(setUi({ display: e.target.checked }))}
            />
            <span>Render UI</span>
          </label>
        </S.Section>
      </S.Block>
      <S.Block>
        <S.Title>Voronoi diagram points:</S.Title>
        <S.Section>
          <button onClick={handleGenerateClick}>Generate</button>
          <input
            type="number"
            min="1"
            max="100000"
            value={displaySettings.generateAmount}
            onInput={handleGenerateInput}
            required
            ref={inputRefs.generateAmount}
          />
          <span>
            {isOutOfBounds('generateAmount') && (
              <span title="Out of bounds">⚠️</span>
            )}
          </span>
        </S.Section>
        <S.Section>
          <S.FileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
          />
          {/* <button onClick={handleInputButton} disabled={reading}>
            {reading ? 'Reading...' : 'Read from image'}
          </button> */}
        </S.Section>
        <S.Section>
          <span>Margin: </span>
          <input
            type="number"
            min="0"
            max="1000"
            onInput={handleMarginInput}
            value={displaySettings.margin}
            required
            ref={inputRefs.margin}
          />
          <span>
            {isOutOfBounds('margin') && <span title="Out of bounds">⚠️</span>}
          </span>
        </S.Section>
      </S.Block>
    </S.Container>
  )
}
