import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { importSchema } from 'graphql-import'
import resolvers from './graphql/resolvers'
import cors from 'cors'

const PORT = 3001

const app = express()
app.use(cors())

var redis = require('redis');
var client = redis.createClient();
client.on('error', function(err){
  console.log('Something went wrong ', err)
});
client.set('my test key', 'my test value', redis.print);
client.get('my test key', function(error, result) {
  if (error) throw error;
  console.log('GET result ->', result)
});

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

app.listen(PORT, () => {
  console.log('running with cors')
})
