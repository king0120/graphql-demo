import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { importSchema } from 'graphql-import'
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import resolvers from './graphql/resolvers'
import cors from 'cors'
import mongoose from 'mongoose'

const PORT = 3001

const app = express()

app.use(cors())

mongoose.connect('mongodb://localhost/graphql-demo')
  .then(() => console.log('connected to mongo!'))


// The GraphQL schema in string form
const typeDefs = importSchema(__dirname + '/graphql/schema.graphql')

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:3001/subscriptions`
})) // if you want GraphiQL enabled

// wrap the express server
const ws = createServer(app)
ws.listen(PORT, () => {
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
