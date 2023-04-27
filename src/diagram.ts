import { initials } from './params'
import { IPlot, IProps } from './types'
import { rnd } from './utils'
import { Delaunay } from 'd3-delaunay'

const _draw = ({
  ctx,
  props,
}: {
  ctx: CanvasRenderingContext2D
  props: IProps
}) => {
  ctx.clearRect(0, 0, props.width, props.height)

  const p = new Path2D()

  props.pts.forEach(([x, y]) => {
    p.moveTo(x, y)
    p.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2)
  })

  ctx.save()
  ctx.fillStyle = 'white'
  ctx.fill(p)
  ctx.restore()

  const delaunay = Delaunay.from(props.pts)
  const { points, triangles, halfedges } = delaunay

  const p2 = new Path2D()

  delaunay.render(p2)

  ctx.save()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'red'
  ctx.stroke(p2)
  ctx.restore()

  const p3 = new Path2D()

  const voronoi = delaunay.voronoi([0, 0, props.width, props.height])
  const { circumcenters, vectors } = voronoi

  // for (var i = 0; i < circumcenters.length; i += 2) {
  //   const x = circumcenters[i]
  //   const y = circumcenters[i + 1]
  //   p3.moveTo(x, y)
  //   p3.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2)
  // }

  for (let i = 0, n = delaunay.triangles.length / 3; i < n; ++i) {
    const cx = voronoi.circumcenters[i * 2]
    const cy = voronoi.circumcenters[i * 2 + 1]
    const x0 = delaunay.points[delaunay.triangles[i * 3] * 2]
    const y0 = delaunay.points[delaunay.triangles[i * 3] * 2 + 1]
    const r = Math.sqrt((cx - x0) ** 2 + (cy - y0) ** 2)
    p3.moveTo(cx + r, cy)
    p3.arc(cx, cy, r, 0, 2 * Math.PI)
    p3.moveTo(cx, cy)
    p3.arc(cx, cy, 2, 0, 2 * Math.PI)
  }

  ctx.save()
  ctx.strokeStyle = 'green'
  ctx.stroke(p3)
  ctx.restore()

  const p4 = new Path2D()

  // for (var i = 0; i < vectors.length; i += 4) {
  //   const x1 = vectors[i]
  //   const x2 = vectors[i + 1]
  //   const y1 = vectors[i + 2]
  //   const y2 = vectors[i + 3]
  //   p4.moveTo(x1, y1)
  //   p4.lineTo(x1, y1)
  //   p4.moveTo(x2, y2)
  //   p4.lineTo(x2, y2)
  // }

  // for (let i of voronoi.cellPolygons()) {
  //   console.log(i)
  // }

  voronoi.render(p4)

  // voronoi.renderCell(4, p4)

  ctx.save()
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)'
  ctx.stroke(p4)
  ctx.restore()
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
    pts: [],
    margin: initials.margin,
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

  props.pts = Array.from(new Array(20)).map(() => [
    rnd(initials.margin, props.width - initials.margin * 2),
    rnd(initials.margin, props.height - initials.margin * 2),
  ])

  draw()

  return {
    draw,
    destroy,
  }
}

export { createPlot }
