import { TaskPayload } from '../features/tasks/tasks-slice'
import {
  arrayMoveMutable,
  arrayMoveImmutable,
  getPercentage,
  groupTasksByCompletedStatus,
  getTaskArrayFromGroupedTasks,
  truncateText,
  getPlainPreview,
} from './utils'

describe('arrayMoveMutable', () => {
  it('should not mutate array if there are no elements', () => {
    const theArray: any[] = []
    arrayMoveMutable(theArray, 0, 1)

    expect(theArray).toHaveLength(0)
  })

  test('passing a negative number to fromIndex should use 0 instead', () => {
    const theArray = ['test', 'another test']
    arrayMoveMutable(theArray, -1, 1)

    expect(theArray).toHaveLength(2)
    expect(theArray[0]).toBe('test')
    expect(theArray[1]).toBe('another test')
  })

  test('passing a negative number to toIndex should use 0 instead', () => {
    const theArray = ['test', 'another test']
    arrayMoveMutable(theArray, 1, -1)

    expect(theArray).toHaveLength(2)
    expect(theArray[0]).toBe('test')
    expect(theArray[1]).toBe('another test')
  })
})

describe('arrayMoveImmutable', () => {
  it('should move the element to the desired position', () => {
    const theArray = ['test', 'testing']
    const newArray = arrayMoveImmutable(theArray, 0, 1)

    expect(theArray).toHaveLength(2)
    expect(theArray[0]).toBe('test')
    expect(theArray[1]).toBe('testing')

    expect(newArray).toHaveLength(2)
    expect(newArray[0]).toBe('testing')
    expect(newArray[1]).toBe('test')
  })
})

describe('getPercentage', () => {
  it('should return 0 if the first number is 0', () => {
    const percentage = getPercentage(0, 1)
    expect(percentage).toBe(0)
  })

  it('should return 0 if the second number is 0', () => {
    const percentage = getPercentage(1, 0)
    expect(percentage).toBe(0)
  })

  it('should swap first number with second number, if the later is greater', () => {
    const percentage = getPercentage(10, 1)
    expect(percentage).toBe(10)
  })

  it('should trucate numbers up to two places', () => {
    expect(getPercentage(38.2, 125)).toBe(30.56)
    expect(getPercentage(67.55, 125)).toBe(54.04)
    expect(getPercentage(86.65, 125)).toBe(69.32)
    expect(getPercentage(98.85, 125)).toBe(79.08)
  })

  it('should return the percentage of two numbers', () => {
    expect(getPercentage(4, 20)).toBe(20)
    expect(getPercentage(10, 10)).toBe(100)
    expect(getPercentage(10, 100)).toBe(10)
    expect(getPercentage(10, 40)).toBe(25)
    expect(getPercentage(15, 30)).toBe(50)
  })
})

describe('groupTasksByCompletedStatus', () => {
  it('should return open tasks and completed tasks', () => {
    const tasks: TaskPayload[] = [
      {
        id: 'test-1',
        description: 'Testing #1',
        completed: false,
      },
      {
        id: 'test-2',
        description: 'Testing #2',
      },
      {
        id: 'test-3',
        description: 'Testing #3',
        completed: true,
      },
    ]

    const { openTasks, completedTasks } = groupTasksByCompletedStatus(tasks)

    expect(openTasks).toHaveLength(2)
    expect(openTasks[0]).toBe(tasks[0])
    expect(openTasks[1]).toBe(tasks[1])

    expect(completedTasks).toHaveLength(1)
    expect(completedTasks[0]).toBe(tasks[2])
  })
})

describe('getTaskArrayFromGroupedTasks', () => {
  it('should return an array of tasks', () => {
    const workTasks = [
      {
        id: 'test-b-1',
        description: 'Test #1',
      },
      {
        id: 'test-b-2',
        description: 'Test #2',
        completed: true,
      },
    ]

    const personalTasks = [
      {
        id: 'test-c-1',
        description: 'Test #3',
      },
      {
        id: 'test-c-2',
        description: 'Test #4',
        completed: true,
      },
    ]

    const groupedTasks = {
      Work: workTasks,
      Personal: personalTasks,
    }

    const taskArray = getTaskArrayFromGroupedTasks(groupedTasks)

    expect(taskArray).toHaveLength(workTasks.length + personalTasks.length)
    expect(taskArray).toStrictEqual([...workTasks, ...personalTasks])
  })
})

describe('truncateText', () => {
  it('should return the text as-is', () => {
    const text = 'This is a simple text. It should not be truncated.'

    expect(truncateText(text, 100)).toBe(text)
  })

  it('should return the truncated text', () => {
    const text = 'This is a simple text. It should not be truncated.'
    const truncated = truncateText(text, 10)

    expect(truncated).toHaveLength(13) // Includes ellipsis
    expect(truncated).toBe('This is a ...')
  })
})

describe('getPlainPreview', () => {
  it('should return a text preview in the format: {open tasks}/{all tasks}', () => {
    const workTasks = [
      {
        id: 'test-b-1',
        description: 'Test #1',
      },
      {
        id: 'test-b-2',
        description: 'Test #2',
        completed: true,
      },
    ]

    const personalTasks = [
      {
        id: 'test-c-1',
        description: 'Test #3',
      },
      {
        id: 'test-c-2',
        description: 'Test #4',
        completed: true,
      },
      {
        id: 'test-c-3',
        description: 'Test #5',
      },
    ]

    const groupedTasks = {
      Work: workTasks,
      Personal: personalTasks,
    }

    expect(getPlainPreview(groupedTasks)).toBe('3/5 tasks completed')
    expect(getPlainPreview({})).toBe('0/0 tasks completed')
    expect(getPlainPreview({ Test: [] })).toBe('0/0 tasks completed')
  })
})
