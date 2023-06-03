import { IPlot } from './types'

export const te: (msg: string) => never = (msg) => {
  throw new Error(msg)
}

export const rnd = (from: number, to: number): number => {
  from = Math.floor(from)
  to = Math.floor(to)

  return from + Math.floor((to - from) * Math.random())
}

/** Throws if .current is null. Should be called when you're sure it should've been initialized */
export const getPlot = (plotRef: React.MutableRefObject<IPlot | null>) => {
  return plotRef.current ?? te('Plot ref is null')
}
