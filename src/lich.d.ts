/**
 *
 * {
 *    "click #btn": function(event, element){
 *
 *    }
 * }
 */
export type TBindEventsObject = Record<
  string,
  (event: Event, element: Element) => void
>
