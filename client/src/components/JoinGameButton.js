import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import faker from 'faker'
import Button from '@material-ui/core/es/Button/Button'
import { withRouter } from 'react-router-dom'

const JOIN_GAME = gql`
    mutation joinGame($playerName: String!, $gameId: ID!) {
        joinGame(playerName: $playerName, gameId: $gameId){
            _id
            players {
                _id
            }
        }
    }
`

const JoinGameButton = ({ game, history }) => {

  return (
    <Mutation mutation={JOIN_GAME}>
      {(joinGame, { data }) => (
        <Button
          onClick={() => {
            const playerName = faker.internet.userName()
            joinGame({
              variables: {
                gameId: game._id,
                playerName
              }
            })
            localStorage.setItem('player-name', playerName)
            history.push('/room/' + game._id)
          }}
        >Join Game</Button>
      )}
    </Mutation>
  )
}

export default withRouter(JoinGameButton)
