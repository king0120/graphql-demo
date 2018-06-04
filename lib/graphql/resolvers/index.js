import axios from 'axios'
import { Game, Player } from '../../db/models'
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

async function nextQuestion(game) {
  const newQuestion = await getTrivia(1)
  console.log(newQuestion)
  game.questions.push(...newQuestion)
  await game.save()
  return game
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
    getGame: async (_, { _id, playerId }) => {
      const game = await Game.findById(_id)
      const numberOfPlayersRemaining = game.players.filter(p => !p.eliminated).length

      if (game.started && numberOfPlayersRemaining === 0) {

        game.completed = true
        const saved = await game.save()
        return saved

      } else if (game.started && playerId === game.host.toString()) {

        const withNewQuestion = await nextQuestion(game)
        return withNewQuestion

      } else {
        return game
      }
    }
  },
  Mutation: {
    newGame: async (_, args) => {

      const player = new Player({name: args.playerName,
        color: 'blue',
        points: 0
      })

      const game = await Game.create({
        host: player._id,
        players: [ player ],
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
    },
    submitAnswer: async (_, {gameId, questionId, playerId, answer}) => {
      const game = await Game.findById(gameId)
      const question = game.questions.id(questionId)
      console.log(playerId)
      const player = game.players.id(playerId)

      console.log(game)
      console.log(player)
      player.eliminated = true
      await game.save()
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
