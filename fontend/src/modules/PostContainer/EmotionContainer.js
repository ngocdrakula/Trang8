import React, { Component } from 'react';
import axios from '../../axios';



export default class EmotionContainer extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
    PostEmotion = (e) => {
      if(this.props.user){
        var data = {
          active_id: this.props.active,
          comment_id: this.props.comment,
          emotion: e
        }
        axios.post("/post/emotion", data)
        .then(response => {
          if(response.data){
            if(response.data.success)
            this.props.updateActive(response.data.data)
          }
        })
      }
      else{
        document.getElementById('login').click();
      }
    }
  render() {
    var emotion = 0; var emotionIndex = -1; var emotionLengthString = ""
    if(this.props.user){
      emotionIndex = this.props.emotion.findIndex(e => {
        return e.author._id === this.props.user._id
      });
      if(emotionIndex > -1) emotion = this.props.emotion[emotionIndex].emotion;
    }
    if(this.props.emotion.length){
      if(emotion){
        emotionLengthString += "Bạn";
      }
      else{
        emotionLengthString += this.props.emotion[0].author.username;
      }
      if(this.props.emotion.length === 2){
        emotionLengthString += " và " + this.props.emotion[1 - (emotionIndex > -1 ? emotionIndex : 0)].author.username;
      }
      else if(this.props.emotion.length > 2){
        emotionLengthString += " và " + (this.props.emotion.length - 1) + " người khác"
      }
    }
    return (
        <div className="emotionContainer">
          <div className="emotionList">
            {[1, 2, 3, 4, 5].map(i => {
              return(
                <div className={"emotion" + (i === emotion ? " used" : "")} key={i} onClick={() => {i === emotion ? this.PostEmotion(0) :this.PostEmotion(i)}}>
                  <span className={"emotion_" + i}></span>
                </div>
              );
            })}
          </div>
          <div className="emotionNumber">
            {emotionLengthString}
          </div>
        </div>
    );
  }
}