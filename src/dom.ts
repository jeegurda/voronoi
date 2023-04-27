export const qs = <T extends HTMLElement | SVGElement>(qs: string): T => {
  const el = document.querySelector<T>(qs)
  if (el === null) {
    console.error('%o is missing from the DOM', el)
    throw new Error('Missing element')
  }
  return el
}

export const dom = {
  root: qs<HTMLDivElement>('.root'),
} as const
