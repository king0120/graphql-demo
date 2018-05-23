import axios from 'axios'

export default {
  Query: {
    trivia: async (_, {limit}) => {
      const res = await axios.get(`https://opentdb.com/api.php?amount=${limit}`)
      return res.data.results
    }
  },
  // Mutation: {
  // },
  // Subscription: {
  // }
}
