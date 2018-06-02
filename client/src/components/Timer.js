import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Timer extends Component {
  state = {
    countdown: 10
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000)
  }

  getDerivedStateFromProps(nextProps) {
    console.log('nextProps', nextProps)
  }

  timer = () => {
    this.setState({
      countdown: this.state.countdown - 1
    })
    if (this.state.countdown < 1) {
      clearInterval(this.intervalId)
    }
  }

  render () {
    return <h3>{this.state.countdown}</h3>
  }
}

Timer.propTypes = {}

export default Timer
