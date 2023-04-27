import { dom } from './dom'
import { createRoot } from 'react-dom/client'
import { Root } from './components/Root'
import { createElement, StrictMode } from 'react'

createRoot(dom.root).render(
  createElement(StrictMode, null, createElement(Root)),
)
