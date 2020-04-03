import React, { Component } from 'react';
import EmotionContainer from './EmotionContainer';
import WriteComment from './WriteComment';
import CommentContainer from './CommentContainer';


export default class PostActive extends Component {
    state = {
      showComment: false
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
      this.setState({
        active: this.props.active
      })
    }
    updateActive = (active) => {
      this.setState({active});
    }
    showCommentHandle = () => {
      this.setState({showComment: !this.state.showComment})
    }
  render() {
    if(this.state.active){
      return (
          <div className="active">
            <div className="activeContainer">
              <EmotionContainer
                emotion={this.state.active.emotion}
                active={this.props.active._id}
                user={this.props.user}
                updateActive={this.updateActive} />
              <div className="show" onClick={this.showCommentHandle}>{this.state.showComment ? "Ẩn bình luận" : "Xem bình luận (" + this.state.active.comment.length + ")"}</div>
            </div>
              {this.state.showComment ?
                (this.state.active.comment.length ? 
                  <div className="commentList">
                    {this.state.active.comment.map(comment => {
                      return(
                        <CommentContainer
                          key={comment._id}
                          comment={comment}
                          active={this.props.active._id}
                          user={this.props.user}
                          updateActive={this.updateActive}
                        />
                      )
                    })}
                  </div>
                :
                  <div className="commentList">
                    <div className="medium">Hãy là người đầu tiên bình luận về bài viết này!</div>
                  </div>
                )
              : ""}
            <WriteComment
              active={this.props.active._id}
              updateActive={this.updateActive}
            />
          </div>
      );
    }
    else return(<div></div>)
  }
}