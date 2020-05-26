import React, { Component } from 'react';
import axios from '../../axios';
import FormButton from '../Form/FormButton';


export default class PostActive extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }
    checkEnter = (e) => {
        if(e.keyCode === 13 && !e.shiftKey){
            e.preventDefault();
            e.target.style.height = "20px";
            this.sendComment();
        }
    }
    inputChange = (e) => {
      e.target.style.height = "20px";
      e.target.style.height = (e.target.scrollHeight - 16) + "px";
      this.setState({comment: e.target.value});
    }
    sendComment = (e) => {
      if(e){
        e.preventDefault();
      }
      if(this.state.comment){
        var data = {
            _id: this.props.active,
            comment: this.state.comment
        }
        axios.post("/post/comment", data)
        .then(response => {
          if(response.data){
            if(response.data.success){
              this.setState({comment: ""});
              this.props.updateActive(response.data.data)
            }
          }
        })
      }
    }

  render() {
    return (
      <div className="writeComment">
        <form onSubmit={this.sendComment}>
            <div className="form-group">
              {this.props.user ? 
                <>
                  <textarea placeholder="Viết bình luận"
                    onChange={this.inputChange}
                    onKeyDown={this.checkEnter}
                    value={this.state.comment}
                  />
                  <div className="input">
                      <input type="submit" value ="Gửi" />
                  </div>
                </>
              :
                <FormButton className="comment-textarea" formType="login">
                  <textarea placeholder="Viết bình luận"
                    onChange={this.inputChange}
                    onKeyDown={this.checkEnter}
                    value={this.state.comment}
                  />
                  <div className="input">
                      <input type="submit" value ="Gửi" />
                  </div>
                </FormButton>
              }
          </div>
        </form>
      </div>
    );
  }
}