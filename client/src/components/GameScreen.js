import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/es/Button/Button'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import AnswerButton from './AnswerButton'


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
    query getGame($_id: ID!) {
        getGame(_id: $_id){
            _id
            started
            question
            questions{
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

class GameScreen extends React.Component {
    state = {
      countdown: 10
    }

    componentDidMount() {
      this.intervalId = setInterval(this.timer, 1000)
    }

    timer = () => {
      this.setState({
        countdown: this.state.countdown - 1
      })
      if (this.state.countdown < 1) {
        clearInterval(this.intervalId)
      }
    }

    render() {
      return (
        <Query
          query={GAME_DATA}
          variables={{ _id: this.props.match.params.gameId }}
          pollInterval={10000}
        >
          {({loading, error, data}) => {

            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`

            const game = data.getGame

            return (
              <GameScreenContainer>
                <div>
                  <h1>Question {game.question + 1}</h1>
                  <h3>{this.state.countdown}</h3>
                </div>

                <div>
                  {game.questions[game.question].question}
                </div>
                <ButtonContainer>
                  {game.questions[game.question].answers.map((answer, i) => (
                    <AnswerButton
                      key={i}
                      gameId={this.props.match.params.gameId}
                      questionId={game.questions[game.question]._id}
                      playerName={this.state.playerName}
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
    }

}

export default GameScreen


// When navigating to this screen,
// Fetch a trivia question. Make sure to show that there is no answer submitted
// When user answers, make a post to check if answer is correct or not
// after 10 seconds, see what users exist
// if users still exist, fetch the next question
// if users do not exist, then go to win screen
