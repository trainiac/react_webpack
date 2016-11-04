/**
    @module express-jsonschema
    @author Adrian Adkison
 */


import { css, StyleSheet } from 'aphrodite'
import _ from 'lodash/fp'

const mapValues = _.mapValues.convert({ cap: false })
const reduce = _.reduce.convert({ cap: false })

const getStateClassName = (className, state) => `g-${className}-${state}`

const helperClassNameToStyleSheetStyles = (className, context) => helperClassName => {

  const styleSheetStyles = context.otherStylesStyleSheet[helperClassName] ||
                           context.contextStylesStyleSheet[helperClassName]

  if (!styleSheetStyles) {

    throw new Error(
      `Under the class name: ${className} you referenced a
      class name: ${helperClassName} in the helpers or states keys
      that could not be found.`
    )

  }

  return styleSheetStyles

}

const stateClassNameToStyleSheetStyles = (className, context) => stateClassName =>
  context.styleSheet[getStateClassName(className, stateClassName)] ||
  helperClassNameToStyleSheetStyles(className, context)(stateClassName)

const toStateClassName = className => state => getStateClassName(className, state)

const wrapGetStateFunc = (context, className, getStateFunc) => (...args) => {

  const computedClassNames = _.compact(getStateFunc(...args))

  const classNameStyleSheets = _.map(
      stateClassNameToStyleSheetStyles(className, context)
  )(computedClassNames)

  return { className: css(context.styleSheet[className], ...classNameStyleSheets) }

}

const findSpecialStyleKeys = context => (next, classNameStyles, className) => {

  const { helpers, getState, states, ...cssStyles } = classNameStyles

  next.cssStyles[className] = cssStyles

  if (helpers) {

    next.helpers[className] = _.map(
      helperClassNameToStyleSheetStyles(className, context)
    )(helpers)

  }

  if (states) {

    const stateClassNames = _.mapKeys(toStateClassName(className))(states)

    next.cssStyles = _.assign(stateClassNames)(next.cssStyles)

  }

  if (getState) {

    next.getStateFuncs[className] = getState

  }

  return next

}

const getClassNameFunc = context => (classNameStyles, className) => {

  const getStateFunc = context.getStateFuncs[className]

  if (getStateFunc) {

    return wrapGetStateFunc(
      context,
      className,
      context.getStateFuncs[className]
    )

  }

  let stylesToApply = [context.styleSheet[className]]
  const helperStyleSheetStyles = context.helpers[className]

  if (helperStyleSheetStyles) {

    stylesToApply = [...stylesToApply, ...helperStyleSheetStyles]

  }

  return () => ({ className: css(...stylesToApply) })

}

const addResultToContext = func => context => ({ ...context, ...func(context) })

const createOtherStylesStyleSheet = context => {

  let otherStylesStyleSheet = {}
  let contextStylesStyleSheet = {}

  if (context.otherStyles) {

    otherStylesStyleSheet = StyleSheet.create(context.otherStyles)

  }

  if (context.contextStyles) {

    contextStylesStyleSheet = StyleSheet.create(context.contextStyles)

  }

  return { otherStylesStyleSheet, contextStylesStyleSheet }

}

const gatherAllSpecialStyleKeys = context => reduce(findSpecialStyleKeys(context))({
  helpers: {},
  states: {},
  getStateFuncs: {},
  cssStyles: {}
})(context.styles)

const createStyleSheet = context => ({ styleSheet: StyleSheet.create(context.cssStyles) })

const getClassNameFuncs = context => mapValues(getClassNameFunc(context))(context.cssStyles)

const stylesToClassNameFunc = _.flow(
    addResultToContext(createOtherStylesStyleSheet),
    addResultToContext(gatherAllSpecialStyleKeys),
    addResultToContext(createStyleSheet),
    getClassNameFuncs
)

const girdle = (styles, otherStyles, contextStyles) =>
  stylesToClassNameFunc({ styles, otherStyles, contextStyles })

export const girdleGlobals = contextStyles => (styles, otherStyles) =>
  girdle(styles, otherStyles, contextStyles)

export default girdle
