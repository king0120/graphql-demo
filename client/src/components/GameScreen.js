import React from 'react'
import Header from './common/Header'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const PLAYER_ADDED = gql`
    subscription playerAdded($gameId: ID!){
        playerAdded(gameId: $gameId) {
            name
        }
    }
`

const GET_GAME = gql`{
  getGame(_id: "5b06cc624a1a830db4ef83ed"){
    _id
    players {
      name
    }
  }
}
`
const GameScreen = (props) => {
  return (
    <Query query={GET_GAME}>
      { ({ loading, error, data }) => {
        const gameData = data.getGame
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        console.log(!loading && JSON.stringify(gameData))
        return (
          <Subscription
            subscription={PLAYER_ADDED}
            variables={{ gameId: props.match.params.gameId }}
          >
            {({ data, loading }) => {
              return (
                <div>
                  <Header title={'Waiting Room'}/>
                  <h2>{gameData.players.length}/4 Players Available</h2>
                  <ul>
                    {gameData.players.map((player, i) => (
                      <li key={i}>{player.name}</li>
                    ))}
                  </ul>
                </div>
              )
            }}
          </Subscription>
        )
      }}
    </Query>
  )
}

export default GameScreen
