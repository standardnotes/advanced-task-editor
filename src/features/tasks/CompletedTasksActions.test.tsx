import { fireEvent, screen } from '@testing-library/react'
import { testRender } from '../../testUtils'

import { RootState } from '../../app/store'
import CompletedTasksActions from './CompletedTasksActions'
import { deleteAllCompleted, openAllCompleted } from './tasks-slice'

const group = 'default group'

it('renders two buttons', () => {
  testRender(<CompletedTasksActions group={group} />)

  expect(screen.getByTestId('reopen-completed-button')).toHaveTextContent(
    'Reopen Completed'
  )
  expect(screen.getByTestId('delete-completed-button')).toHaveTextContent(
    'Delete Completed'
  )
})

it('should not render buttons if can not edit', () => {
  const defaultState: Partial<RootState> = {
    settings: {
      canEdit: false,
      isRunningOnMobile: false,
      spellCheckerEnabled: true,
    },
  }

  testRender(<CompletedTasksActions group={group} />, {}, defaultState)

  expect(
    screen.queryByTestId('reopen-completed-button')
  ).not.toBeInTheDocument()
  expect(
    screen.queryByTestId('delete-completed-button')
  ).not.toBeInTheDocument()
})

it('should dispatch openAllCompleted action', () => {
  const { mockStore } = testRender(<CompletedTasksActions group={group} />)

  const reOpenCompletedButton = screen.getByTestId('reopen-completed-button')
  fireEvent.click(reOpenCompletedButton)

  const confirmDialog = screen.getByTestId('reopen-all-tasks-dialog')
  expect(confirmDialog).toBeInTheDocument()
  expect(confirmDialog).toHaveTextContent(
    `Are you sure you want to reopen completed tasks on the '${group}' group?`
  )

  const confirmButton = screen.getByTestId('confirm-dialog-button')
  fireEvent.click(confirmButton)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(openAllCompleted({ group }))
})

it('should dispatch deleteCompleted action', () => {
  const { mockStore } = testRender(<CompletedTasksActions group={group} />)

  const deleteCompletedButton = screen.getByTestId('delete-completed-button')
  fireEvent.click(deleteCompletedButton)

  const confirmDialog = screen.getByTestId('delete-completed-tasks-dialog')
  expect(confirmDialog).toBeInTheDocument()
  expect(confirmDialog).toHaveTextContent(
    `Are you sure you want to delete completed tasks on the '${group}' group?`
  )

  const confirmButton = screen.getByTestId('confirm-dialog-button')
  fireEvent.click(confirmButton)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(deleteAllCompleted({ group }))
})
