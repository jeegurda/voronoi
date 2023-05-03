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
import { IMainState, IPlot, RootState } from '../types'
import * as React from 'react'
import { te } from '../utils'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isAssertClause } from 'typescript'

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
  const [displaySettings, setDisplaySettings] = useState<{
    [key in keyof RootState['settings']]: string
  }>(() => ({
    generateAmount: String(settings.generateAmount),
    margin: String(settings.margin),
  }))

  const dispatch = useDispatch()

  useEffect(() => {
    const plot = plotRef.current ?? te('Ref is null')

    plot.updateStyle(style)
    plot.draw()
  }, [style])

  useEffect(() => {
    const plot = plotRef.current ?? te('Ref is null')

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
    const plot = plotRef.current ?? te('Ref is null')

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

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const inputRefs: {
    [key in keyof RootState['settings']]: MutableRefObject<HTMLInputElement | null>
  } = {
    generateAmount: useRef<HTMLInputElement>(null),
    margin: useRef<HTMLInputElement>(null),
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

  const [reading, setReading] = useState(false)

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
        const plot = plotRef.current ?? te('Plot ref is null')

        plot.drawFromBitmap(bitmap)

        input.value = ''
        setReading(false)
      })
      img.src = result
    })
    fr.readAsDataURL(file)
  }

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
