export interface IPlot {
  draw: () => void
  destroy: () => void
}

type Point = [number, number]

export interface IProps {
  width: number
  height: number
  pts: Point[]
  margin: number
}
