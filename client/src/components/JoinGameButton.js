import React from 'react'
import { gql } from 'graphql-tag'

const JOIN_GAME = gql`
    mutation joinGame {
        joinGame(playerName: "jim", gameId: "5b05c8f1bcb4373828572867"){
            _id
            players {
                name
            }
        }
    }
`

const JoinGameButton = () => {

  return (
    <div>

    </div>
  )
}

export default JoinGameButton
