import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import faker from 'faker'
import Button from '@material-ui/core/es/Button/Button'
import { withRouter } from 'react-router-dom'

const START_GAME = gql`
    mutation startGame($gameId: ID!) {
        startGame(gameId: $gameId){
            _id
            players {
                name
            }
        }
    }
`

const StartGameButton = ({ gameId, history }) => {

    return (
        <Mutation mutation={START_GAME}>
            {(startGame, { data }) => (
                <Button
                    onClick={() => {
                        startGame({
                            variables: {
                                gameId: gameId,
                            }
                        })
                        history.push('/game/' + gameId)
                    }}
                >Start Game</Button>
            )}
        </Mutation>
    )
}

export default withRouter(StartGameButton)
