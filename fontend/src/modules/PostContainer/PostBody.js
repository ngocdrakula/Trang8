import React, { Component } from 'react';
import PostStatus from './PostStatus';
import PostActive from './PostActive';



export default class PostBody extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }

  render() {
      return (
        <div className="newsBody">
            <PostStatus status={this.props.post.status} image={this.props.post.image} />
            <PostActive active={this.props.post.active} user={this.props.user}/>
        </div>
    );
  }
}