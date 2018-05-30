import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import faker from 'faker'
import Button from '@material-ui/core/es/Button/Button'
import { withRouter } from 'react-router-dom'
import { Context } from '../Provider'

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
    <Context.Consumer>
      {context => (
        <Mutation
          mutation={JOIN_GAME}
          update={(cache, {data}) => {
            const newPlayer = data.joinGame.players[data.joinGame.players.length - 1]
            context.updatePlayerId(newPlayer._id)
            history.push('/room/' + game._id)
          }}
        >
          {(joinGame, response) => {
            return (
              <Button
                onClick={() => {
                  console.log('MUTATING')
                  const playerName = faker.internet.userName()
                  joinGame({
                    variables: {
                      gameId: game._id,
                      playerName
                    }
                  })
                }}
              >Join Game</Button>
            )
          }
          }
        </Mutation>
      )}
    </Context.Consumer>
  )
}

export default withRouter(JoinGameButton)
