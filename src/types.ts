import { store } from './components/store'

export interface IPlot {
  draw: () => void
  destroy: () => void
  randomize: () => void

  updateStyle: (style: IMainState['style']) => void
  updateSettings: (settings: IMainState['settings']) => void

  drawFromBitmap: (bitmap: ImageBitmap) => void

  props: IProps
}

export type Point = [number, number]

export interface IProps {
  width: number
  height: number
  pts: Point[]
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface IRenderStyle {
  display: boolean
  color: string
  width: number
}

export interface IMainState {
  canvasRes: string
  renderRes: string
  settings: {
    margin: number
    generateAmount: number
  }
  style: {
    dTriangulation: IRenderStyle
    dCircumcircles: IRenderStyle
    vVertices: IRenderStyle
    vSegments: IRenderStyle
    vBounds: Pick<IRenderStyle, 'display'>
    vFill: Pick<IRenderStyle, 'display'>
  }
  ui: {
    display: boolean
  }
  redrawUi: number
}

export type TCallbacks = {
  resize?: ({
    ctx,
    props,
  }: {
    ctx: CanvasRenderingContext2D
    props: IProps
  }) => void
  updateUi?: ({ props }: { props: IProps }) => void
}
