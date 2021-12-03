import type { TBindEventsObject } from '../lich'
import { assert } from './'

// store removeEventListener
// when trigger beforeUnload lifecycle, these will be removed.
const removeEvents: Array<() => void> = []

/**
 * get removeEventListener functions
 *
 * @returns removeEvents
 */
export const getRemoveEventListeners = () => removeEvents

function storeRemoveEventListener(
  element: Element,
  eventName: string,
  event: (event: Event) => void,
) {
  removeEvents.push(() => element.removeEventListener(eventName, event))
}

/**
 * Traverse `events` and compile to addEventListener.
 *
 * @param events Events object to be parsed.
 */
export function compileBindEvents(events: TBindEventsObject): void {
  Object.keys(events).forEach(compile => {
    // the event name and the element that needs to be bound to the event
    // will be parsed from the key in the `events` object in a space-separated manner.
    const spacePosition = compile.indexOf(' ')

    // compile event name
    const eventName = compile.substring(0, spacePosition)
    // compile selector
    const selector = compile.substring(spacePosition + 1, compile.length)
    const formatErrorMsg = `events \`key\` format error : ${compile}, eg: '[event] [selector]': [callback]`

    // if not include a whitespace.
    assert(-1 !== spacePosition, formatErrorMsg)

    // if compile selector is equal a empty string.
    assert(selector !== '', formatErrorMsg)

    /**
     * There are two situations for binding element events.
     *
     * When page is initialized
     * 1. if the element already exists, then directly bind events to the element.
     * 2. if the element doesn't exist, we need to bind events to the element through event proxy.
     *
     * ---------
     * while binding the event, store the unbound event function of the bound event in `removeEvents` object.
     * when the page trigger `beforeUnload` lifecycle hooks, these removeEventListener functions will be executed.
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
