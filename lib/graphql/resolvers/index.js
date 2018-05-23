import axios from 'axios'
import Game from '../../db/Game'
import { PubSub, withFilter } from 'graphql-subscriptions'


const pubsub = new PubSub()
export default {
  Query: {
    trivia: async (_, {limit}) => {
      const res = await axios.get(`https://opentdb.com/api.php?amount=${limit}`)
      return res.data.results
    }
  },
  Mutation: {
    newGame: async (_, args) => {
      const game = await Game.create({
        players: [{
          name: args.playerName,
          color: 'blue',
          points: 0
        }],
        started: false
      })
      return game
    },
    joinGame: async (_, {playerName, gameId}) => {
      const game = await Game.findById(gameId)
      const newPlayer = {
        name: playerName,
        color: 'blue',
        points: 0
      }
      game.players.push(newPlayer)

      pubsub.publish('playerAdded', newPlayer)

      const saved = await game.save()
      return saved
    }
  },
  Subscription: {
    playerJoined: async (_, {gameId}) => {

    }
  }
}
