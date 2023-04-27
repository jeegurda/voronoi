import { IPlot, IProps } from './types'

const _draw = ({
  ctx,
  props,
}: {
  ctx: CanvasRenderingContext2D
  props: IProps
}) => {
  ctx.clearRect(0, 0, props.width, props.height)

  ctx.moveTo(100, 100)
  ctx.lineTo(150, 150)
  ctx.strokeStyle = 'white'
  ctx.stroke()
}

const _destroy = ({
  ctx,
  props,
  handleResize,
}: {
  ctx: CanvasRenderingContext2D
  props: IProps
  handleResize: () => void
}) => {
  ctx.clearRect(0, 0, props.width, props.height)

  window.removeEventListener('resize', handleResize)
}

const _setSize = ({
  ctx,
  props,
}: {
  ctx: CanvasRenderingContext2D
  props: IProps
}) => {
  props.width = ctx.canvas.clientWidth
  props.height = ctx.canvas.clientHeight

  ctx.canvas.width = props.width
  ctx.canvas.height = props.height
}

const createPlot = ({ ctx }: { ctx: CanvasRenderingContext2D }): IPlot => {
  const props: IProps = {
    width: 0,
    height: 0,
  }

  const handleResize = () => {
    setSize()
    draw()
  }

  const setSize = _setSize.bind(null, { ctx, props })
  const draw = _draw.bind(null, { ctx, props })
  const destroy = _destroy.bind(null, { ctx, props, handleResize })

  const init = () => {
    setSize()
    window.addEventListener('resize', handleResize)

    console.log('Initialized with w/h %o/%o', props.width, props.height)
  }

  init()
  draw()

  return {
    draw,
    destroy,
  }
}

export { createPlot }
