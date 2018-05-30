import React, { Component } from 'react'
const Context = React.createContext()
class Provider extends Component {
    state = {
      playerId: ''
    }

    updatePlayerId = (playerId) => {
      this.setState({playerId})
    }
    render() {
      return (
        <Context.Provider>
          {this.props.children}
        </Context.Provider>
      )
    }
}

export default Provider
