require('./styles/normalize.css') // eslint-disable-line no-unused-vars
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './containers/Root'

render(
  <AppContainer>
    <Root/>
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {

  module.hot.accept('./containers/Root', () => {

    const RootContainer = require('./containers/Root').default  // eslint-disable-line global-require

    render(
      <AppContainer>
        <RootContainer/>
      </AppContainer>,
      document.getElementById('root')
    )

  })

}
