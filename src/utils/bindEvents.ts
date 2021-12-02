import type { TBindEventsObject } from '../lich'
import { assert } from './'

// store removeEventListener
// when trigger beforeUnload lifecycle, these will be removed.
let removeEvents: Array<() => void> = []

function storeRemoveEventListener(
  element: Element,
  eventName: string,
  event: (event: Event) => void,
) {
  removeEvents.push(() => element.removeEventListener(eventName, event))
}

export const getRemoveEventListeners = () => removeEvents

export function compileBindEvents(events: TBindEventsObject) {
  Object.keys(events).forEach(compile => {
    const spacePosition = compile.indexOf(' ')
    // 获取待解析的事件名称
    const eventName = compile.substring(0, spacePosition)

    // 获取待解析的元素
    const selector = compile.substring(spacePosition + 1, compile.length)
    const formatErrorMsg = `绑定事件对象中的 key 格式有误: ${compile}, 格式参照: '[event] [selector]': [callback]`

    // 不包含空格
    assert(-1 !== spacePosition, formatErrorMsg)
    // 解析后元素为空
    assert(selector !== '', formatErrorMsg)

    /**
     * 绑定元素事件分2种情况.
     * 1. 如果页面初始化时元素已存在则直接可以为元素绑定事件.
     * 2. 如果页面初始化时元素不存在则需要通过事件代理的方式来为元素绑定事件.
     *
     * -----
     * 在绑定事件的同时, 将绑定事件的解绑事件存储至 *removeEvents* 中,
     * 当页面触发 *beforeUnload* 生命周期钩子时 将会执行这些 removeEventListener,
     */
    const elements = document.querySelectorAll(selector)

    if (elements.length > 0) {
      elements.forEach(element => {
        const bindEvent = (event: Event) => {
          events[compile](event, element)
        }
        storeRemoveEventListener(element, eventName, bindEvent)
        element.addEventListener(eventName, bindEvent)
      })
    } else {
      const bindEvent = (event: Event) => {
        if ((event.target as Element).matches(selector)) {
          events[compile](event, event.target as Element)
        }
      }
      storeRemoveEventListener(document.body, eventName, bindEvent)
      document.body.addEventListener(eventName, bindEvent)
    }
  })
}
