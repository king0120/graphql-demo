import mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
  name: String,
  color: String,
  points: Number,
  host: {
    type: Boolean,
    default: false
  },
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
  questions: [QuestionSchema],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'player'
  },
  started: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
})


export default mongoose.model('game', GameSchema)
