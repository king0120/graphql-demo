import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Context } from '../Provider'
import Button from '@material-ui/core/es/Button/Button'

const SUBMIT_ANSWER = gql`
    mutation submitAnswer($gameId: ID!, $questionId: ID!, $playerId: ID!, $answer: String!) {
        submitAnswer(gameId: $gameId, questionId: $questionId, playerId: $playerId, answer: $answer){
            correct
            correct_answer
        }
    }
`

const AnswerButton = ({ gameId, questionId, answer }) => {
  return (
    <Context.Consumer>
      {context => (
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
                      gameId,
                      questionId,
                      answer,
                      playerId: context.state.playerId
                    }
                  })
                }}
              >{answer}</Button>
            )
          }}
        </Mutation>
      )}
    </Context.Consumer>
  )
}

export default AnswerButton
