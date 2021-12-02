/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * Lich Page
 *
 * Page Lifecycle: beforeLoad => load => afterLoad => beforeUnload => unload
 */
import { compileBindEvents, getRemoveEventListeners } from '../utils'

export class Lich {
  constructor() {
    this.beforeLoad()
    document.addEventListener('readystatechange', () => {
      switch (document.readyState) {
        case 'interactive':
          this.load()
          break
        case 'complete':
          compileBindEvents(this.events)
          this.afterLoad()

          console.log(getRemoveEventListeners())
          break
        default:
          break
      }
    })
    window.addEventListener('beforeunload', () => {
      // will be deleted event listener
      getRemoveEventListeners().map(remove => remove())

      // 执行页面中的beforeUnload 生命周期钩子.
      this.beforeUnload()
    })
    window.addEventListener('unload', () => {
      // TODO: trash recycling
      this.unload()
    })
  }

  public events = {}

  beforeLoad() {}
  load() {}
  afterLoad() {}
  beforeUnload() {}
  unload() {}
}
