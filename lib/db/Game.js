import mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
  name: String,
  color: String,
  points: Number,
  eliminated: {
    type: Boolean,
    default: false
  }
})

const QuestionSchema = new mongoose.Schema({
  category: String,
  difficulty: String,
  question: String,
  correct_answer: String,
  answers: [String]
})

const GameSchema = new mongoose.Schema({
  players: [PlayerSchema],
  question: {
    type: Number,
    default: 0
  },
  questions: [QuestionSchema],
  started: Boolean
})

export default mongoose.model('game', GameSchema)
