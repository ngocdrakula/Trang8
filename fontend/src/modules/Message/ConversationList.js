import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageBox from './MessageBox';
import axios from '../../axios';
import socket from '../../socket';
import origin from '../../origin';
import Time from '../Time';
import MessageButton from './MessageButton';

class ConversationList extends Component {
  constructor(props){
    super(props);
    this.state = {
      order: 0
    }
  }
  componentDidMount(){
    axios.get('/conversation/')
    .then(response => {
      if(response.data && response.data.success){
        var conversations = response.data.data;
        var newMessage = [];
        for(let i=0; i < conversations.length; i ++){
          for(let j=i; j < conversations.length; j++){
            if(i === 0){
              var con = conversations[j].conversation;
              if(con.message[0].author !== this.props.user._id){
                if(con.leader.user === this.props.user._id){
                  if(Date.parse(con.leader.seen) < Date.parse(con.message[0].createdAt)){
                    newMessage.push(con.member.user);
                  }
                }
                else if(con.member.user === this.props.user._id){
                  if(Date.parse(con.member.seen) < Date.parse(con.message[0].createdAt)){
                    newMessage.push(con.leader.user);
                  }
                }
                else{console.log('dell')}
              }
            }
            if(conversations[i].conversation.message[0].createdAt < conversations[j].conversation.message[0].createdAt){
              let temp = conversations[i];
              conversations[i] = conversations[j];
              conversations[j] = temp;
            }
          }
        }
        this.props.dispatch({
          type: 'CREATE_CONVERSATIONS',
          conversations: conversations,
          newMessage: newMessage
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }
  render() {
    var conversations = [];
    if(this.props.conversations){
      var end = Math.min(this.props.conversations.length - this.state.order + 10, this.props.conversations.length);
      conversations = this.props.conversations.slice(this.state.order, end);
    }
    return(
      <div className={this.props.onShow ? "inboxContainer" : "hidden"} onClick={this.props.selectConversation}>
        {this.props.conversations.length ? 
          this.props.conversations.map((con, index) => {
            var conversation = con.conversation;
            var author = "Bạn";
            var inboxNew = "";
            if(conversation.message[0].author === con.to._id){
              author = con.to.username;
              if(conversation.leader.user === con.to._id){
                if(Date.parse(conversation.member.seen) < Date.parse(conversation.message[0].createdAt)){
                  inboxNew = " inboxNew";
                }
              }
              else if(Date.parse(conversation.leader.seen) < Date.parse(conversation.message[0].createdAt)){
                  inboxNew = " inboxNew";
              }
            }
            return(
                <MessageButton className={"inboxLine" + inboxNew} to={con.to} key={index}>
                    <div className="inboxAvatar">
                      <img src={origin + "/image/avatar/" + con.to._id} />
                    </div>
                    <div className="inboxContent">
                      <div className="inboxUsername">
                        <div className="link textover">
                          {con.to.username}
                        </div>
                          <Time className="conversationTime"
                            createdAt={conversation.message[0].createdAt}
                            title={2} value={1} />
                        </div>
                      <div className="inboxLastMessage textover">
                        {author}: {conversation.message[0].message}
                      </div>
                    </div>
                </MessageButton>
            );
          })
      : "Đang tải"}
      </div>
    );
  }
}

export default connect((state) => ({conversations: state.conversations}))(ConversationList);