import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Button from '@material-ui/core/es/Button/Button'

const SUBMIT_ANSWER = gql`
    mutation submitAnswer($gameId: ID!, $questionId: ID!, $playerName: String!, $answer: String!) {
        submitAnswer(gameId: $gameId, questionId: $questionId, playerName: $playerName, answer: $answer){
            correct
            correct_answer
        }
    }
`

const AnswerButton = ({ gameId, questionId, playerName, answer }) => {
  return (
    <Mutation mutation={SUBMIT_ANSWER}>
      {(submitAnswer, { data }) => {
        let color = 'default'

        if (data && data.submitAnswer.correct) {
          color = 'primary'
        } else if (data && !data.submitAnswer.correct) {
          color = 'secondary'
        }
        return (
          <Button variant="raised" size="small" color={color}
            onClick={() => {
              submitAnswer({
                variables: {
                  gameId, questionId, playerName, answer
                }
              })
            }}
          >{answer}</Button>
        )
      }}
    </Mutation>
  )
}

export default AnswerButton
