import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import CardContent from '@material-ui/core/es/CardContent/CardContent'
import Card from '@material-ui/core/es/Card/Card'
import styled from 'styled-components'
import Button from '@material-ui/core/es/Button/Button'
import Header from './common/Header'
import JoinGameButton from './JoinGameButton'

const StyledCard = styled(Card)`
  width: calc(100% - 30px);
  margin: 15px;
  &>div{
    display: flex;
    justify-content: space-between;
  }
`


const GET_GAMES = gql`
    {
        games {
            _id
            started
            players {
                name
                color
                points
            }
        }
    }
`

const GamesListScreen = (props) => {
  return (
    <Query query={GET_GAMES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const { games } = data
        return (
          <div>
            <Header title={'Join A Game'}/>

            {data && data.games && games.map(game => (
              <StyledCard key={game._id}>
                <CardContent>
                  <div>
                    <h2>
                      {game.players[ 0 ].name}'s Game
                    </h2>
                    <h4>
                      Players: {game.players.length}/4
                    </h4>
                  </div>
                  {game.players.length < 4 && !game.started
                    ? <JoinGameButton game={game}/>
                    : null
                  }

                </CardContent>
              </StyledCard>
            ))}
          </div>
        )
      }}
    </Query>
  )
}

export default GamesListScreen
