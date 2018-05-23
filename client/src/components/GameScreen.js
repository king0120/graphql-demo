import React from 'react'
import Header from './common/Header'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const PLAYER_ADDED = gql`
    subscription playerAdded($gameId: ID!){
        playerAdded(gameId: $gameId) {
            name
        }
    }
`

const GameScreen = (props) => {
  return (
    <Subscription
      subscription={PLAYER_ADDED}
      variables={{ gameId: props.match.params.gameId }}
    >
      {({ data, loading }) => {
        return (
          <div>
            <Header title={'Waiting Room'}/>
            Game SCREEN
            {!loading && JSON.stringify(data.playerAdded)}
          </div>
        )
      }}
    </Subscription>
  )
}

export default GameScreen
