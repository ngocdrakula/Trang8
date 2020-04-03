import React, { Component } from 'react';
import { connect } from 'react-redux';


class MessageButton extends Component {
  constructor(props){
    super(props);
  }
  InboxTo = () => {
    this.props.dispatch({
      type: 'OPEN_CONVERSATION',
      to: this.props.to,
      focus: true
    })
  }
  render() {
    return(
      <div className={this.props.className} onClick={this.InboxTo}>
          {this.props.Text || this.props.children}
      </div>
    );
  }
}

export default connect()(MessageButton);