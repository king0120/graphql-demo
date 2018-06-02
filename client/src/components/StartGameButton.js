import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Button from '@material-ui/core/es/Button/Button'
import { withRouter } from 'react-router-dom'

const START_GAME = gql`
    mutation startGame($gameId: ID!) {
        startGame(gameId: $gameId){
            _id
            questions{
                question
            }
            players {
                name
            }
        }
    }
`

const StartGameButton = ({ gameId, history }) => {

  return (
    <Mutation mutation={START_GAME}>
      {(startGame, { data }) => {
        if (data) {
          console.log(data)
          console.log('complete!')
          history.push('/game/' + gameId)
        }
        return (
          <Button
            onClick={() => {
              startGame({
                variables: {
                  gameId: gameId
                }
              })
            }}
          >Start Game</Button>
        )
      }}
    </Mutation>
  )
}

export default withRouter(StartGameButton)
