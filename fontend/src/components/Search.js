import React, { Component } from 'react';

export default class Search extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
  render() {
    return (
      <div  className="news">
        Trang web đang được xây dựng
        <br />
        q: {this.props.q}
      </div>
      );
  }
}