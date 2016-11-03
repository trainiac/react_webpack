import _ from 'lodash/fp'
import { isValidElement } from 'react'
import { girdleGlobals } from './girdle'

export const isTypeComponent = type => child =>
  isValidElement(child) && _.get('type.displayName')(child) === type

export const trace = (tag, func) => input => {

  const value = func(input)
  console.log(tag, value)  // eslint-disable-line no-console
  return value

}

export const girdle = girdleGlobals({
  clearfix: {
    ':after': {
      visibility: 'hidden',
      display: 'block',
      fontSize: 0,
      content: '" "',
      clear: 'both',
      height: 0
    }
  },
  disabled: {
    opacity: 0.5
  }
})
