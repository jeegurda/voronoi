export const te = (msg: string): never => {
  throw new Error(msg)
}

export const rnd = (from: number, to: number): number => {
  from = Math.floor(from)
  to = Math.floor(to)
  return from + Math.floor((to - from) * Math.random())
}
