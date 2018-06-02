import React, { Component } from 'react'

export const Context = React.createContext()

export class Provider extends Component {
    state = {
      playerId: localStorage.getItem('player-id') || ''
    }

    updatePlayerId = (playerId) => {
      this.setState({playerId})
      localStorage.setItem('player-id', playerId)
    }

    render() {
    return (
      <Context.Provider value={{
        state: this.state,
        updatePlayerId: this.updatePlayerId
      }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}
