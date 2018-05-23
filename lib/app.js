import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { importSchema } from 'graphql-import'
import resolvers from './graphql/resolvers'

const PORT = 3000

const app = express()

// The GraphQL schema in string form
const typeDefs = importSchema(__dirname + '/graphql/schema.graphql')

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })) // if you want GraphiQL enabled

app.listen(PORT)
