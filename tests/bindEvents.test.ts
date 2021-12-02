/**
 * @jest-environment jsdom
 */
// import { compileBindEvents } from '../src'
// import type { TBindEventsObject } from '../src/lich.d'

import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  waitFor,
} from '@testing-library/dom'
import '@testing-library/jest-dom'

const getExampleDOM = () => {
  const div = document.createElement('div')
  div.innerHTML = `
    <label for="username">Username</label>
    <input type="text" id="username" />
    <button>Print Username</button>
  `

  const button = div.querySelector('button')
  const input = div.querySelector('input')
  button.addEventListener('click', () => {
    setTimeout(() => {
      const printedUsernameContainer = document.createElement('div')
      printedUsernameContainer.innerHTML = `
        <div data-testid="printed-username">${input.value}</div>
      `
      div.appendChild(printedUsernameContainer)
    }, Math.floor(Math.random() * 200))
  })
  return div
}

test('examples of some things', async () => {
  const famousProgrammerInHistory = 'Ada Lovelace'
  const container = getExampleDOM()
  const input = getByLabelText(container, 'Username')

  ;(input as HTMLInputElement).value = famousProgrammerInHistory

  getByText(container, 'Print Username').click()

  await waitFor(() =>
    expect(queryByTestId(container, 'printed-username')).toHaveTextContent(
      famousProgrammerInHistory,
    ),
  )
})
