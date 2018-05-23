import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

import { WebSocketLink } from 'apollo-link-ws'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3001/subscriptions`,
  options: {
    reconnect: true
  }
})

const client = new ApolloClient({
  link: wsLink,
  uri: 'http://localhost:3001/graphql'
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('root'))
registerServiceWorker()
