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

const GameSchema = new mongoose.Schema({
  players: [PlayerSchema],
  started: Boolean
})

export default mongoose.model('game', GameSchema)
