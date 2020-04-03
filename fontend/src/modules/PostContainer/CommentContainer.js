import React, { Component } from 'react';
import origin from '../../origin';
import EmotionContainer from './EmotionContainer';
import Time from '../Time';



export default class CommentContainer extends Component {
    state = {
      seemore: 0
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
        var comment = this.props.comment.comment; var seemore = 0;
        if((comment.length > 200 || comment.split("\n").length > 6) && this.props.comment.image){
          comment = comment.slice(0, 500);
          seemore = 1;
        }
        else if(comment.length>500){
          comment = comment.slice(0, 500);
          seemore = 1;
        }
        else if(comment.split("\n").length>10){
          comment = comment.split("<br />").slice(0,10).join("<br />");
          seemore = 1;
        }
        this.setState({
          comment: comment.split("\n"),
          seemore: seemore
        })
    }
    seeAll = () => {
        this.setState({
          comment: this.props.comment.comment.split("\n"),
          seemore: 0
        })
    }
  render() {
    if(this.state.comment){
      return (
          <div className="commentLine">
            <div className="commentContainer">
              <div className="commentAvatar">
                  <a href={"/profile/" + this.props.comment.author._id}>
                      <img src={origin + "/image/avatar/" + this.props.comment.author._id} />
                  </a>
              </div>
              <div className="comment">
                <span className="commentUsername">
                  <a href={"/profile/" + this.props.comment.author._id}>
                      {this.props.comment.author.username}
                  </a>
                </span>
                <span className="commentText">
                  {this.state.comment.map((text, line) => {
                      return(
                          <span key={line}>
                              {text}
                              {line < this.state.comment.length - 1 ? <br /> : ""}
                          </span>
                      );
                  })}
                  {this.state.seemore ? 
                      <span className="link" onClick={this.seeAll}>... Xem thêm</span>
                      : ""
                  }
                </span>
              </div>
            </div>
            <div className="commentEmotion">
              <EmotionContainer
                emotion={this.props.comment.emotion}
                active={this.props.active}
                comment={this.props.comment._id}
                user={this.props.user}
                updateActive={this.props.updateActive}
              />
              <Time className="commentTime" title="2" value="1" createdAt={this.props.comment.createdAt} />
            </div>
          </div>
      );
    }
    else return (<div></div>);
  }
}