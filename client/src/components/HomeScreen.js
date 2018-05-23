import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
  render () {
    return (
      <Flex>
        <header>
          <Header>grap<strong>HQ</strong>l</Header>
        </header>
        <div>
          <h3>Enter Your Name</h3>
          <input />
        </div>
        <Button variant="raised" color="primary">
          Create a New Room
        </Button>
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
