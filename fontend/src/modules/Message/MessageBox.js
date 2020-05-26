import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios';
import socket from '../../socket'
import origin from '../../origin';

import Time from '../../modules/Time'

class MessageBox extends Component {
    state = {
    };
    constructor(props){
        super(props);
        this.state={
            messageList: [],
            loaded: false,
            toBottom: true,
            newMessage: false
        }
    }
    componentDidMount(){
        axios.get('/conversation/' + this.props.to._id + '?order=0')
        .then(messageList => {
            console.log(messageList.data)
          if(messageList.data && messageList.data.success){

            var conversation = messageList.data.data;
            var seen = Date.now();
            var newMessage = false;
            var message = [];
            console.log('toi day1')
            if(conversation){
                console.log('toi day2')
                message = conversation.message;
                if(conversation.leader.user === this.props.user._id){
                    seen = Date.parse(conversation.leader.seen);
                }
                else{
                    seen = Date.parse(conversation.member.seen);
                }
                var lastMessage = conversation.message.slice(-1)[0];
                conversation.message = [lastMessage];
                if(lastMessage.author === this.props.to._id && seen < Date.parse(lastMessage.createdAt)){
                    newMessage = true;
                }
                this.props.dispatch({
                    type: 'UPDATE_CONVERSATIONS',
                    to: this.props.to,
                    conversation: conversation,
                    newMessage: newMessage
                });
            }
            else{
                console.log('toi day3')
                this.props.dispatch({
                    type: 'OPEN_CONVERSATIONS',
                    to: this.props.to,
                    conversation: conversation,
                    newMessage: newMessage
                });
            }
            console.log('toi day4')
            this.setState({
                messageList: message,
                seen: seen,
                newMessage: newMessage,
                loaded: true,
                onFocus: true
            });
          }
        }).catch(err => {
          console.log(err);
        });
        socket.on(this.props.user._id, data => {
          if(data.type === 'message' || data.type === 'mymessage'){
            var toId = data.to._id || data.to;
            if(toId === this.props.to._id){
                axios.get('/conversation/' + toId + '?order=0')
                .then(response => {
                    if(response.data && response.data.success){
                        var lastMessage = response.data.data.message[response.data.data.message.length - 1];
                        var messageList = this.state.messageList;
                        messageList.push(lastMessage);
                        var conversation = response.data.data;
                        conversation.message = conversation.message.slice(-1);
                        this.props.dispatch({
                            type: 'UPDATE_CONVERSATIONS',
                            to: this.props.to,
                            conversation: conversation,
                            newMessage: data.type === 'message' ? true : false,
                        });
                        this.setState({
                            newMessage: data.type === 'message' ? true : false,
                            messageList: messageList
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
          }
          else if(data.type === 'read' && data.to === this.props.to._id){
            this.props.dispatch({
                type: 'READ_MESSAGE',
                to: this.props.to,
                time: data.time
            });
            this.setState({
                newMessage: false,
                seen: Date.parse(data.time)
            });
          }
        });
    }
    readMessage = () => {
        if(this.state.newMessage){
            axios.get("/conversation/read/" + this.props.to._id)
            .then(response => {
                if(response.data && response.data.success){
                    this.setState({newMessage: false})
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    checkKeyDown = (e) => {
        if(e.keyCode === 13 && !e.shiftKey){
            e.preventDefault();
            e.target.style.height = "14px";
            this.sendMessage();
        }
        if(e.keyCode === 27){
            this.hideBox();
        }
    }
    writeMessage = (e) => {
        e.target.style.height = "14px";
        e.target.style.height = (e.target.scrollHeight - 22) + "px";
        if(this.state.newMessage){
            this.readMessage();
        }
        this.setState({
            message: e.target.value
        });
    }
    sendMessage = (e) => {
        if(e){
            e.preventDefault();
        }
        var data = {
            message: this.state.message,
            to: this.props.to._id
        }
        axios.post('/conversation', data)
        .then(response => {
            if(response.data && response.data.success){
                this.setState({
                    message: ""
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    hideBox = () => {
        this.setState({
            onFocus: false
        })
        this.props.dispatch({
            type: 'CLOSE_CONVERSATION',
            to: this.props.to
        });
    }
    focusToWritting = (e) => {
        if(e.target.querySelector('span'))
            this.Textarea.focus();
    }
    scrollToTop = (e) => {
    }
  render() {
    return (
        this.props.onShow ? 
            <div className="mesBox" onClick={this.focusToWritting}>
                <div className="mesTitle">
                    <a href={"/profile/" + this.props.to._id}>
                        {this.props.to.username}
                    </a>
                </div>
                <div className="mesConversation" onClick={this.readMessage} onScroll={this.scrollToTop}>
                    {this.state.loaded ?
                        this.state.messageList.length ?
                            this.state.messageList.map((mes, index) => {
                                if(this.props.user._id !== mes.author){
                                    return(
                                        <div className="mesLine" key={index}>
                                            <div className="mesAvatar">
                                                <a href={"/profile/" + mes.author}>
                                                    <img src={origin + "/image/avatar/" + mes.author} title={this.props.to.username} />
                                                </a>
                                            </div>
                                            <div className="mesOther">
                                                <div className="mesContentContainer">
                                                    <div className="mesContent" style={{fontWeight: Date.parse(mes.createdAt) < this.state.seen ? 'normal' : 'bold'}}>
                                                        {mes.message.split("\n").map((messageLine, line) => {
                                                            return(
                                                                <span key={line}>
                                                                    {messageLine}
                                                                    <br />
                                                                </span>
                                                            )

                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mesTimeContainer left">
                                                    <Time className="mesTime" title="2" value="3" createdAt={mes.createdAt} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                else{
                                    return(
                                        <div className="mesLine" key={index}>
                                            <div className="mesAuthor">
                                                <div className="mesContentContainer">
                                                    <div className="mesContent">
                                                        {mes.message.split("\n").map((messageLine, line) => {
                                                            return(
                                                                <span key={line}>
                                                                    {messageLine}
                                                                    {messageLine ? <br /> : ""}
                                                                </span>
                                                            )

                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mesTimeContainer right">
                                                    <Time className="mesTime" title="2" value="3" createdAt={mes.createdAt} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        :
                            <div className="mesLoader" id="loader_inbox_${to._id}">
                                Bạn hãy là người bắt đầu cuộc trò chuyện!
                            </div>
                    : 
                        <div className="mesLoader" id="loader_inbox_${to._id}">
                            Đang tải...
                        </div>
                    }
                    <div ref={(e) => {if(e && this.state.toBottom){e.scrollIntoView(true);}}} />
                </div>
                <div className="mesInput">
                    <form action="/messages" onSubmit={this.sendMessage}>
                        <div className="form-group">
                            <div className="mesBoxTextarea">
                                <textarea value={this.state.message || ""}
                                onChange={this.writeMessage}
                                onKeyDown={this.checkKeyDown}
                                onClick={this.readMessage}
                                ref={(e) => {this.Textarea = e; if(e && this.props.focus){this.readMessage();  e.focus();}}} 
                                placeholder="Viết tin nhắn" />
                            </div>
                            <div className="mesBoxSubmit">
                                <input type="submit" value="Gửi" onClick={this.readMessage}/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="closeButton" onClick={this.hideBox} title="Đóng">X</div>
            </div>
        : ""
    );
  }
}
export default connect()(MessageBox);