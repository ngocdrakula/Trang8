import React, { Component } from 'react';

import News from '../modules/News';

export default class Home extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
  render() {
    return (
      <div className="news">
        <News user={this.props.user} />
      </div>
    );
  }
}