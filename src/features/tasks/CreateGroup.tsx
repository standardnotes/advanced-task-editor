import { ChangeEvent, createRef, KeyboardEvent, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { tasksGroupAdded } from './tasks-slice'

import { BigTextInput, WideButton } from '../../common/components'

const CreateGroup: React.FC = () => {
  const inputRef = createRef<HTMLInputElement>()

  const dispatch = useAppDispatch()

  const [group, setGroup] = useState('')
  const [isCreateMode, setIsCreateMode] = useState(false)

  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const spellCheckerEnabled = useAppSelector(
    (state) => state.settings.spellCheckerEnabled
  )

  function toggleMode() {
    setIsCreateMode(!isCreateMode)
  }

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    setGroup(event.target.value)
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value
      if (rawString.length > 0) {
        dispatch(tasksGroupAdded(rawString))
      }

      setIsCreateMode(false)
      setGroup('')
    }
  }

  if (!canEdit) {
    return <></>
  }

  return (
    <>
      {!isCreateMode && (
        <WideButton data-testid="create-group-button" onClick={toggleMode}>
          +
        </WideButton>
      )}
      {isCreateMode && (
        <BigTextInput
          testId="create-group-input"
          value={group}
          onChange={onTextChange}
          onKeyPress={handleKeyPress}
          placeholder="Name your task group and press enter"
          ref={inputRef}
          spellCheck={spellCheckerEnabled}
          autoFocus
        />
      )}
    </>
  )
}

export default CreateGroup
