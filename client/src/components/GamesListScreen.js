import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import CardContent from '@material-ui/core/es/CardContent/CardContent'
import Card from '@material-ui/core/es/Card/Card'

const GET_GAMES = gql`
    {
        games {
            _id
            players {
                name
                color
                points
            }
        }
    }
`

const GamesListScreen = () => {
  return (
    <Query query={GET_GAMES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const { games } = data
        return (
          <div>
            {games.map(game => (
              <Card>
                <CardContent>
                  {JSON.stringify(game)}
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }}
    </Query>
  )
}

export default GamesListScreen
