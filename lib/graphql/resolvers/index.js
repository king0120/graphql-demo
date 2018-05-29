import axios from 'axios'
import Game from '../../db/Game'
import { PubSub, withFilter } from 'graphql-subscriptions'


const pubsub = new PubSub()
export default {
  Query: {
    trivia: async (_, { limit }) => {
      const res = await axios.get(`https://opentdb.com/api.php?amount=${limit}`)
      return res.data.results
    },
    games: async () => {
      const games = await Game.find()
      return games
    },
    getGame: async (_, { _id }) => {
      const game = await Game.findById(_id)
      return game
    }
  },
  Mutation: {
    newGame: async (_, args) => {
      const game = await Game.create({
        players: [ {
          name: args.playerName,
          color: 'blue',
          points: 0
        } ],
        started: false
      })
      return game
    },
    joinGame: async (_, { playerName, gameId }) => {
      const game = await Game.findById(gameId)
      const newPlayer = {
        name: playerName,
        color: 'blue',
        points: 0
      }
      game.players.push(newPlayer)

      pubsub.publish('playerAdded', {
        playerAdded: newPlayer,
        gameId: gameId
      })

      const saved = await game.save()
      return saved
    },
      startGame: async (_, {gameId}) => {
          const game = await Game.findById(gameId)
          game.started = true
          const savedGame = await game.save()
          return savedGame
      }
  },
  Subscription: {
    playerAdded: {
      resolve: (payload) => {
        console.log(payload)
        return payload ? payload.playerAdded : 'waiting'
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator('playerAdded'),
        (payload, variables) => {
          console.log(payload)

          // The `playerAdded` channel includes events for all channels, so we filter to only
          // pass through events for the channel specified in the query
          return payload.gameId === variables.gameId
        }
      )
    }
  }
}
