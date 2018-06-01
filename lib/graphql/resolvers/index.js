import axios from 'axios'
import Game from '../../db/Game'
import { PubSub, withFilter } from 'graphql-subscriptions'


const pubsub = new PubSub()

async function getTrivia (limit) {
  const res = await axios.get(`https://opentdb.com/api.php?amount=${limit}`)
  return res.data.results.map(result => {
    result.answers = [...result.incorrect_answers, result.correct_answer]
    delete result.incorrect_answers
    return result
  })

}
export default {
  Query: {
    trivia: async (_, { limit }) => {
      const question = await getTrivia(limit)
      return question
    },
    games: async () => {
      const games = await Game.find()
      return games
    },
    getGame: async (_, { _id }) => {
      const game = await Game.findById(_id)
      return game
    },
    nextQuestion: async (_, { gameId }) => {
      const game = await Game.findById(_id)
      const newQuestion = await getTrivia(1)
      game.questions.push(newQuestion)
      await game.save()
      return newQuestion
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
      const getFirstQuestion = await getTrivia(1)
      console.log('first question', getFirstQuestion)
      game.questions.push(getFirstQuestion[0])
      const savedGame = await game.save()
      return savedGame
    },
    submitAnswer: async (_, {gameId, questionId, playerId, answer}) => {
      const game = await Game.findById(gameId)
      const question = game.questions.id(questionId)
      const player = game.players.id(playerId)

      console.log(player)
      const correct = answer === question.correct_answer
      return {
        correct,
        correct_answer: question.correct_answer
      }
    }
  },
  Subscription: {
    playerAdded: {
      resolve: (payload) => {
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
