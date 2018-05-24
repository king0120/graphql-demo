import React from 'react'
import Header from './common/Header'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/es/Button/Button'

const PLAYER_ADDED = gql`
    subscription playerAdded($gameId: ID!){
        playerAdded(gameId: $gameId) {
            name
        }
    }
`

const GET_GAME = gql`
    query getGame($_id: ID!) {
        getGame(_id: $_id){
            _id
            players {
              name
            }
        }    
    }
`
const GameScreen = (props) => {
  return (
    <Query query={GET_GAME} variables={{ _id: props.match.params.gameId }}>
      { ({ loading, error, data }) => {
        const gameData = data.getGame
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        console.log(gameData.players)
        const playersInRoom = [ ...gameData.players ]
        return (
          <Subscription
            subscription={PLAYER_ADDED}
            variables={{ gameId: props.match.params.gameId }}
          >
            {({ data, loading }) => {
              console.log(!loading && data.playerAdded.name)
              if (!loading &&
                  !playersInRoom.find(player => player.name === data.playerAdded.name)) {
                playersInRoom.push(data.playerAdded)
              }
              return (
                <div>
                  <Header title={'Waiting Room'}/>
                  <h2>{playersInRoom.length}/4 Players Available</h2>
                  <ul>
                    {playersInRoom.map((player, i) => (
                      <li key={i}>{player.name}</li>
                    ))}
                  </ul>
                  <Button>Start Game</Button>
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
