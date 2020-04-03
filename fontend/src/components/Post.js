import React, { Component } from 'react';
import axios from '../axios';

import News from '../modules/News';
import PostContainer from '../modules/PostContainer/PostContainer';
import ErrorPage from './ErrorPage';

export default class Post extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
      axios('/post/' + this.props.postId)
      .then(response => {
        if(response.data){
          if(response.data.success){
            this.setState({post: response.data.data});
          }
          else{
            this.setState({err: true})
          }
        }
      })
    }
  render() {
    if(this.state.post){
      return (
        <div className="news">
          <PostContainer post={this.state.post} user={this.props.user} />
        </div>
      );
    }
    else if(this.err){
      return(
        <ErrorPage />
      )
    }
    else {
      return(
        <div className="news">
          <h1>
            Đang tải..
          </h1>
        </div>
      )
    }
  }
}