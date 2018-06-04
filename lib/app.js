import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import {importSchema} from 'graphql-import'
import {execute, subscribe} from 'graphql'
import {createServer} from 'http'
import {SubscriptionServer} from 'subscriptions-transport-ws'
import resolvers from './graphql/resolvers'
import cors from 'cors'
import mongoose from 'mongoose'
import { ApolloEngine } from 'apollo-engine'
require('dotenv').config()

const PORT = 3001

const app = express()

app.use(cors())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to mongo!'))

// The GraphQL schema in string form
const typeDefs = importSchema(__dirname + '/graphql/schema.graphql')

// Put together a schema
const schema = makeExecutableSchema({typeDefs, resolvers})

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql', subscriptionsEndpoint: `ws://localhost:3001/subscriptions`})) // if you want GraphiQL enabled

// wrap the express server
const ws = createServer(app)
// Initialize Apollo Engine.
console.log(process.env.APOLLO_API_KEY)
const engine = new ApolloEngine({apiKey: process.env.APOLLO_API_KEY})

engine.listen({
  port: PORT,
  httpServer: ws
}, () => {
  console.log('running with cors')

  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions'
  })
})
