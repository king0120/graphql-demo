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

class AnswerButton extends React.Component {
  state = {
    color: 'default'
  }

  getDerivedStateFromProps(nextProps) {
    if (this.props.answer !== nextProps.answer) {
      this.setState('default')
    }
  }

  render() {
    const { gameId, questionId, answer } = this.props
    return (
      <Context.Consumer>
        {context => (
          <Mutation mutation={SUBMIT_ANSWER}>
            {(submitAnswer, { data }) => {

              if (data && data.submitAnswer.correct) {
                this.setState({color: 'primary'})
              } else if (data && !data.submitAnswer.correct) {
                this.setState({color: 'secondary'})
              }
              return (
                <Button variant="raised" size="small" color={this.state.color}
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

}

export default AnswerButton
