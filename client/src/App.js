import React, { Component } from 'react';
import HomeScreen from './components/HomeScreen'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GamesListScreen from './components/GamesListScreen'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={HomeScreen}/>
          <Route exact path='/list' component={GamesListScreen}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
