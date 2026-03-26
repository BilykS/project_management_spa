import type { Directive, DirectiveBinding } from 'vue'

export interface ResizeColumnBinding {
  key: string
  width: number
  onResize: (key: string, width: number) => void
}

const MIN_WIDTH    = 60
const COLOR_HANDLE = '#4f46e5'

export const vResizeColumn: Directive<HTMLElement, ResizeColumnBinding> = {
  mounted(el, binding: DirectiveBinding<ResizeColumnBinding>) {
    applyResizer(el, binding.value)
  },

  updated(el, binding: DirectiveBinding<ResizeColumnBinding>) {
    if (!el.querySelector('.col-resizer')) {
      applyResizer(el, binding.value)
      return
    }
    if (binding.value.width !== binding.oldValue?.width) {
      el.style.width    = `${binding.value.width}px`
      el.style.minWidth = `${binding.value.width}px`
    }
  },

  beforeUnmount(el) {
    el.querySelector('.col-resizer')?.remove()
  },
}

function applyResizer(
  el: HTMLElement,
  { key, width, onResize }: ResizeColumnBinding,
): void {
  el.style.width      = `${width}px`
  el.style.minWidth   = `${width}px`
  el.style.position   = 'relative'
  el.style.userSelect = 'none'

  // After the browser has completed the table layout, bake the actual rendered
  // width back into the store. With `table-layout:fixed` + `width:100%` the
  // browser may distribute leftover space to some columns, making their
  // offsetWidth differ from el.style.width. Capturing the real width now
  // guarantees that startWidth === el.offsetWidth when the user drags —
  // eliminating the jump on the first pixel of movement.
  requestAnimationFrame(() => {
    const actual = el.offsetWidth
    if (actual > 0 && actual !== width) {
      el.style.width    = `${actual}px`
      el.style.minWidth = `${actual}px`
      onResize(key, actual)
    }
  })

  if (el.querySelector('.col-resizer')) return

  // ── Hit area ──────────────────────────────────────────────────────────
  const resizer = document.createElement('div')
  resizer.className = 'col-resizer'
  Object.assign(resizer.style, {
    position:       'absolute',
    top:            '0',
    right:          '0',
    width:          '9px',
    height:         '100%',
    cursor:         'col-resize',
    userSelect:     'none',
    zIndex:         '10',
    display:        'flex',
    alignItems:     'stretch',
    justifyContent: 'flex-end',
  })

  // ── Visual border line ─────────────────────────────────────────────────
  const line = document.createElement('div')
  Object.assign(line.style, {
    width:         '2px',
    background:    'transparent',
    borderRadius:  '1px',
    transition:    'background 0.15s',
    pointerEvents: 'none',
    flexShrink:    '0',
  })
  resizer.appendChild(line)
  el.appendChild(resizer)

  resizer.addEventListener('mouseenter', () => {
    line.style.background = COLOR_HANDLE
  })
  resizer.addEventListener('mouseleave', () => {
    line.style.background = 'transparent'
  })

  // Prevent the click from bubbling to <th> and accidentally triggering sort
  resizer.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation()
  })

  resizer.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Because requestAnimationFrame already baked in the rendered width,
    // el.offsetWidth === el.style.width here — startWidth is reliable.
    const startX     = e.clientX
    const startWidth = el.offsetWidth
    let   moved      = false

    line.style.background = COLOR_HANDLE
    line.style.transition = 'none'

    const onMouseMove = (ev: MouseEvent) => {
      moved = true
      const newWidth = Math.max(MIN_WIDTH, startWidth + ev.clientX - startX)
      el.style.width    = `${newWidth}px`
      el.style.minWidth = `${newWidth}px`
    }

    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup',   onMouseUp)
      line.style.transition = 'background 0.15s'
      line.style.background = 'transparent'
      if (moved) {
        onResize(key, Math.max(MIN_WIDTH, startWidth + ev.clientX - startX))
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup',   onMouseUp)
  })
}
