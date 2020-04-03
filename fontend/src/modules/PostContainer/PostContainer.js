import React, { Component } from 'react';
import PostHeader from './PostHeader';
import PostBody from './PostBody';


export default class PostContainer extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }

  render() {
    return (
        <div className="newsContainer">
            <PostHeader 
                author = {this.props.post.author}
                feeling = {this.props.post.feeling || 0}
                statusType = {this.props.post.imageType || 0}
                to = {this.props.post.to || 0}
                privacy = {this.props.post.privacy}
                createdAt = {this.props.post.createdAt}
                postId={this.props.post._id} />
                
            <PostBody post={this.props.post} user={this.props.user}/>
        </div>
    );
  }
}