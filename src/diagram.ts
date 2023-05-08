import { VoidExpression } from 'typescript'
import { IMainState, IPlot, IProps, RootState, TCallbacks } from './types'
import { rnd, te } from './utils'
import { Delaunay } from 'd3-delaunay'
import { deltaE, rgb2lab } from './color'

/** Generate once for the session */
const hueSet = (() => Array.from(Array(300), () => rnd(0, 256)))()

const _draw = ({
  ctx,
  props,
  style,
}: {
  ctx: CanvasRenderingContext2D
  props: IProps
  style: IMainState['style']
}) => {
  ctx.clearRect(0, 0, props.width, props.height)

  const delaunay = Delaunay.from(props.pts)
  const voronoi = delaunay.voronoi([0, 0, props.width, props.height])

  if (style.dTriangulation.display) {
    const p = new Path2D()

    delaunay.render(p)

    ctx.save()
    ctx.lineWidth = style.dTriangulation.width
    ctx.strokeStyle = style.dTriangulation.color
    ctx.stroke(p)
    ctx.restore()
  }

  if (style.dCircumcircles.display) {
    const p = new Path2D()

    for (let i = 0; i < delaunay.triangles.length / 3; ++i) {
      const cx = voronoi.circumcenters[i * 2]
      const cy = voronoi.circumcenters[i * 2 + 1]
      const x0 = delaunay.points[delaunay.triangles[i * 3] * 2]
      const y0 = delaunay.points[delaunay.triangles[i * 3] * 2 + 1]
      const r = Math.sqrt((cx - x0) ** 2 + (cy - y0) ** 2)
      p.moveTo(cx + r, cy)
      p.arc(cx, cy, r, 0, 2 * Math.PI)
      p.moveTo(cx, cy)
      p.arc(cx, cy, 2, 0, 2 * Math.PI) // TODO: should be filled
    }

    ctx.save()
    ctx.lineWidth = style.dCircumcircles.width
    ctx.strokeStyle = style.dCircumcircles.color
    ctx.stroke(p)
    ctx.restore()
  }

  if (style.vFill.display) {
    let idx = 0

    for (const poly of voronoi.cellPolygons()) {
      const p = new Path2D()
      for (let i = 0; i < poly.length; i++) {
        idx++
        if (i === 0) {
          p.moveTo(poly[i][0], poly[i][1])
        } else {
          p.lineTo(poly[i][0], poly[i][1])
        }
      }

      ctx.save()
      ctx.fillStyle = `hsla(${hueSet[idx % hueSet.length]}, 50%, 50%, 0.5)`
      ctx.fill(p)
      ctx.restore()
    }
  }

  if (style.vVertices.display) {
    const p = new Path2D()

    props.pts.forEach(([x, y]) => {
      p.moveTo(x, y)
      p.ellipse(
        x,
        y,
        style.vVertices.width,
        style.vVertices.width,
        0,
        0,
        Math.PI * 2,
      )
    })

    ctx.save()
    ctx.fillStyle = style.vVertices.color
    ctx.fill(p)
    ctx.restore()
  }

  if (style.vSegments.display) {
    const p = new Path2D()

    voronoi.render(p)

    ctx.save()
    ctx.lineWidth = style.vSegments.width
    ctx.strokeStyle = style.vSegments.color
    ctx.stroke(p)
    ctx.restore()
  }

  if (style.vSegments.display && style.vBounds.display) {
    const p = new Path2D()

    voronoi.renderBounds(p)

    ctx.save()
    ctx.lineWidth = style.vSegments.width * 2
    ctx.strokeStyle = style.vSegments.color
    ctx.stroke(p)
    ctx.restore()
  }
}

const _init = ({
  ctx,
  props,
  handleResize,
  setSize,
  cbs = {},
}: {
  ctx: CanvasRenderingContext2D
  props: IProps
  handleResize: () => void
  setSize: () => void
  cbs: TCallbacks
}) => {
  setSize()
  window.addEventListener('resize', handleResize)

  cbs.resize && cbs.resize({ ctx, props })
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
  const dpr = window.devicePixelRatio

  props.width = ctx.canvas.clientWidth
  props.height = ctx.canvas.clientHeight

  ctx.canvas.width = props.width * dpr
  ctx.canvas.height = props.height * dpr

  ctx.scale(dpr, dpr)
}

const _randomize = ({
  props,
  settings,
}: {
  props: IProps
  settings: IMainState['settings']
}) => {
  props.pts = Array.from(new Array(settings.generateAmount), (_el, _idx) => [
    rnd(settings.margin, props.width - settings.margin),
    rnd(settings.margin, props.height - settings.margin),
  ])
}

const _drawFromBitmap = ({
  bitmap,
  ctx,
  props,
}: {
  bitmap: ImageBitmap
  ctx: CanvasRenderingContext2D
  props: IProps
}) => {
  const ratio = bitmap.width / bitmap.height

  const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height)
  const osCtx = offscreen.getContext('2d') ?? te('Ctx died')

  osCtx.drawImage(bitmap, 0, 0)
  const imgData = osCtx.getImageData(0, 0, bitmap.width, bitmap.height, {
    colorSpace: 'srgb',
  })

  const topLeft = new Uint8ClampedArray([
    imgData.data[0],
    imgData.data[1],
    imgData.data[2],
    imgData.data[3],
  ])

  const outImageData = ctx.createImageData(bitmap.width, bitmap.height, {
    colorSpace: 'srgb',
  })

  const outArr = outImageData.data

  // const colored = []

  // WIP: working with 3 channels only!
  const topLeftLab = rgb2lab(topLeft.slice(0, 3))
  // Delta E tolerance
  const tolerance = 10

  for (let i = 0; i < imgData.data.length; i += 4) {
    const lab = rgb2lab(imgData.data.slice(i, i + 3))
    const distToBg = deltaE(topLeftLab, lab)

    if (distToBg < tolerance) {
      outArr[i] = 255
      outArr[i + 1] = 0
      outArr[i + 2] = 255
      outArr[i + 3] = 255
    } else {
      // colored.push(new Uint8ClampedArray(imgData.data.slice(i, i + 4)))
      outArr[i] = imgData.data[i]
      outArr[i + 1] = imgData.data[i + 1]
      outArr[i + 2] = imgData.data[i + 2]
      outArr[i + 3] = 255
    }
  }

  ctx.clearRect(0, 0, props.width, props.height)
  ctx.putImageData(outImageData, 0, 0)

  // console.log(colored)

  bitmap.close()
}

const createPlot = ({
  ctx,
  cbs = {},
  initialStyle,
  initialSettings,
}: {
  ctx: CanvasRenderingContext2D
  cbs: TCallbacks
  initialStyle: IMainState['style']
  initialSettings: IMainState['settings']
}): IPlot => {
  const props: IProps = {
    width: 0,
    height: 0,
    pts: [],
  }

  const style = Object.assign({}, initialStyle)
  const settings = Object.assign({}, initialSettings)

  const handleResize = () => {
    setSize()
    draw()
    cbs.resize && cbs.resize({ ctx, props })
  }

  const setSize = _setSize.bind(null, { ctx, props })
  const destroy = _destroy.bind(null, { ctx, props, handleResize })
  const init = _init.bind(null, { props, handleResize, setSize, cbs, ctx })
  const updateStyle = (newStyle: IMainState['style']) => {
    Object.assign(style, newStyle)
  }
  const updateSettings = (newSettings: IMainState['settings']) => {
    if (newSettings.generateAmount < props.pts.length) {
      props.pts.splice(
        newSettings.generateAmount,
        props.pts.length - newSettings.generateAmount,
      )
    } else if (newSettings.generateAmount > props.pts.length) {
      for (let i = props.pts.length; i < newSettings.generateAmount; i++) {
        props.pts.push([
          rnd(newSettings.margin, props.width - newSettings.margin),
          rnd(newSettings.margin, props.height - newSettings.margin),
        ])
      }
    }
    Object.assign(settings, newSettings)
  }
  const draw = () => {
    _draw({ ctx, props, style })
    cbs.updateUi && cbs.updateUi({ props })
  }
  const randomize = () => _randomize({ settings, props })

  const drawFromBitmap = (bitmap: ImageBitmap) =>
    _drawFromBitmap({ bitmap, ctx, props })

  init()

  randomize()
  draw()

  return {
    draw,
    destroy,
    randomize,

    updateSettings,
    updateStyle,

    drawFromBitmap,

    props,
  }
}

export { createPlot }
