import React, { Component } from 'react'
import HomeScreen from './components/HomeScreen'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import GamesListScreen from './components/GamesListScreen'
import WaitingRoom from './components/WaitingRoom'
import GameScreen from './components/GameScreen'

class App extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={HomeScreen}/>
          <Route exact path='/game/:gameId' component={GameScreen}/>
          <Route exact path='/room/:gameId' component={WaitingRoom}/>
          <Route exact path='/list' component={GamesListScreen}/>
        </Switch>
      </Router>
    )
  }
}

export default App
