import React from 'react'
import styled from 'styled-components'
import Icon from '@material-ui/core/es/Icon/Icon'
import { withRouter } from 'react-router-dom'

const FlexHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
`


const Header = (props) => {
  return (
    <FlexHeader>
      <Icon onClick={props.history.goBack}>arrow_back</Icon>
      <h1>{props.title}</h1>
    </FlexHeader>
  )
}

export default withRouter(Header)
