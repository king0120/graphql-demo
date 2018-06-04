import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/es/Button/Button'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import AnswerButton from './AnswerButton'
import Timer from './Timer'
import {Context} from '../Provider'


const GameScreenContainer = styled.div`
  height: 100vh;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    
    button {
        margin: 25px;
    }
`


const PlayersContainer = styled.div`
  margin: 20px 0;
  text-align: center;
  .players {
    display: flex;
    justify-content: space-evenly;
  }
`

const PlayerStyle = styled.div`
  text-decoration: ${props => props.eliminated ? 'line-through' : null};
`

const GAME_DATA = gql`
    query getGame($_id: ID!, $playerId: ID) {
        getGame(_id: $_id, playerId: $playerId){
            _id
            started
            host
            questions{
                _id
                question
                answers
            }
            players {
                _id
                name
                eliminated
            }
        }
    }
`

const GameScreenWithContext = ({ context, gameId, history }) => (
  <Query
    query={GAME_DATA}
    variables={{
      _id: gameId,
      playerId: (context && context.state) ? context.state.playerId : null
    }}
    pollInterval={10000}
  >
    {({loading, error, data, stopPolling}) => {

      console.log(context)
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const game = data.getGame

      const numberOfPlayersRemaining = game.players.filter(p => !p.eliminated).length

      if (numberOfPlayersRemaining === 0) {
        stopPolling()
        history.push('/')
        console.log('GAME OVER')
      }

      const currentQuestion = game.questions[game.questions.length - 1]

      return (
        <GameScreenContainer>
          <div>
            <h1>Question {game.questions.length}</h1>
            <Timer />
          </div>
          <div>
            {currentQuestion.question}
          </div>
          <ButtonContainer>
            {currentQuestion.answers.map((answer, i) => (
              <AnswerButton
                key={i}
                gameId={gameId}
                questionId={currentQuestion._id}
                answer={answer}
              />
            ))}
          </ButtonContainer>

          <PlayersContainer>
            <h2>Remaining Players</h2>
            <div className='players'>
              {game.players.map(player => (
                <PlayerStyle key={player._id} eliminated={player.eliminated}>
                  {player.name}
                </PlayerStyle>
              ))}
            </div>
          </PlayersContainer>
        </GameScreenContainer>
      )
    }
    }
  </Query>
)
class GameScreen extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {context => {
          console.log(context)
          console.log(this.props.match.params.gameId)
          return <GameScreenWithContext context={context} history={this.props.history} gameId={this.props.match.params.gameId}/>
        }}
      </Context.Consumer>
    )
  }

}

export default GameScreen
