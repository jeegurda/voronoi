import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit'
import { IMainState, IRenderStyle, RootState } from '../types'

export const initialState: IMainState = {
  canvasRes: '-',
  renderRes: '-',
  style: {
    dTriangulation: {
      display: false,
      width: 0.5,
      color: '#00ff00',
    },
    dCircumcircles: {
      display: false,
      width: 0.5,
      color: '#ff0000',
    },
    vVertices: {
      display: true,
      width: 4,
      color: '#ffffff',
    },
    vSegments: {
      display: true,
      width: 2,
      color: '#ffffff',
    },
    vBounds: {
      display: true,
    },
    vFill: {
      display: true,
    },
  },
  settings: {
    margin: 20,
    generateAmount: 500,
  },
} as const

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setCR: (state, action: PayloadAction<string>) => {
      state.canvasRes = action.payload
    },
    setRR: (state, action: PayloadAction<string>) => {
      state.renderRes = action.payload
    },
    setStyle: (
      state,
      action: PayloadAction<{
        prop: keyof IMainState['style']
        style: Partial<IRenderStyle>
      }>,
    ) => {
      Object.assign(state.style[action.payload.prop], action.payload.style)
    },
    setSettings: (
      state,
      action: PayloadAction<Partial<IMainState['settings']>>,
    ) => {
      Object.assign(state.settings, action.payload)
    },
  },
})

export const { setCR, setRR, setStyle, setSettings } = mainSlice.actions

export const selectCR = (state: RootState) => state.canvasRes
export const selectRR = (state: RootState) => state.renderRes
export const selectStyle = (state: RootState) => state.style
export const selectSettings = (state: RootState) => state.settings

export const store = configureStore({
  reducer: mainSlice.reducer,
})
