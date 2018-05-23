import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/es/TextField/TextField'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const NEW_GAME = gql`
    mutation startNewGame($playerName: String!) {
        newGame(playerName: $playerName){
            _id
        }
    }
`

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100vh;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  header {
    flex-grow: 2;
  }
  button{
    margin: 50px 0;
  }
`
const Header = styled.h1`
  color: white;
  text-shadow: #222222 1px 1px 2px;
  text-align: center;
  font-size: 3rem;
`

class HomeScreen extends Component {
  state = {
    userName: ''
  }

  handleChange = (e) => {
    this.setState({ userName: e.target.value })
  }
  render () {
    return (
      <Flex>
        <header>
          <Header>grap<strong>HQ</strong>l</Header>
        </header>
        <Mutation mutation={NEW_GAME}>
          {(newGame, { data }) => {
            if (data) {
              this.props.history.push('/room/' + data.newGame._id)
            }

            const buttonClick = () => {
              newGame({ variables: { playerName: this.state.userName } })
            }
            return (
              <React.Fragment>
                <div>
                  <h3>Enter Your Name</h3>
                  <TextField
                    value={this.state.userName}
                    onChange={this.handleChange}
                    margin="normal"
                  />
                </div>
                <Button variant="raised" color="primary" onClick={buttonClick}>
                Create a New Room
                </Button>
              </React.Fragment>
            )
          }}
        </Mutation>
        <Link to='/list'>
          <Button variant="raised" color="primary">
          Join a Room
          </Button>
        </Link>
      </Flex>
    )
  }
}

export default HomeScreen
