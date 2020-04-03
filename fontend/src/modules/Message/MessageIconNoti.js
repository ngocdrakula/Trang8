import React, { Component } from 'react';
import { connect } from 'react-redux';


class MessageIconNoti extends Component {
  render() {
    return(
      <div className="notiIcon">
          {this.props.newMessage.length || ""}
      </div>
    );
  }
}

export default connect((state => ({newMessage: state.newMessage})))(MessageIconNoti);