import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Button from '@material-ui/core/es/Button/Button'
import { withRouter } from 'react-router-dom'
import {Context} from '../Provider'

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

const StartGameButton = ({ gameId, history, host }) => {

  return (
    <Context.Consumer>
      {context => (
        <Mutation mutation={START_GAME}>
          {(startGame, {data}) => {
            if (data) {
              console.log(data)
              console.log('complete!')
              history.push('/game/' + gameId)
            }
            console.log(context)
            console.log(host)
            if (context.state.playerId === host) {
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
            } else {
              return (
                <p>Waiting For Host</p>
              )
            }
          }}
        </Mutation>
      )}
    </Context.Consumer>
  )
}

export default withRouter(StartGameButton)
