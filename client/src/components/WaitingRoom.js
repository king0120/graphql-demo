import React from 'react'
import Header from './common/Header'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import StartGameButton from './StartGameButton'

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
            host
            started
            players {
              name
            }
        }    
    }
`

const room = ({ loading, error, data }, props) => {
  const gameData = data.getGame
  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  const gameId = props.match.params.gameId

  if (gameData && gameData.started) {
    props.history.push(`/game/${gameId}`)
  }
  const playersInRoom = [ ...gameData.players ]
  return (
    <Subscription
      subscription={PLAYER_ADDED}
      variables={{gameId}}
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
            <StartGameButton gameId={gameId} host={gameData.host}/>
          </div>
        )
      }}
    </Subscription>
  )
}

const WaitingRoom = (props) => {
  return (
    <Query
      query={GET_GAME}
      variables={{ _id: props.match.params.gameId }}
      pollInterval={500}
    >
      {(data) => room(data, props)}
    </Query>
  )
}

export default WaitingRoom
