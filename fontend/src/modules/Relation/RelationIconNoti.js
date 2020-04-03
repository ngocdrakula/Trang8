import React, { Component } from 'react';
import { connect } from 'react-redux';


class RelationIconNoti extends Component {
  render() {
    return(
      <div className="notiIcon">
          {this.props.request.length || ""}
      </div>
    );
  }
}

export default connect((state => ({request: state.request})))(RelationIconNoti);