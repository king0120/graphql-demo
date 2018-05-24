import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, concat, split } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { getMainDefinition } from 'apollo-utilities'


import { WebSocketLink } from 'apollo-link-ws'

const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql'
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3001/subscriptions`,
  options: {
    reconnect: true
  }
})

const link = split(

  // split based on operation type
  ({ query }) => {
    console.log(query)
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)


const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

console.log(client)
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('root')
)
registerServiceWorker()
