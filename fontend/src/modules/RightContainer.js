import React, { Component } from 'react';
import socket from '../socket';
import MessageButton from './Message/MessageButton'

export default class News extends Component {
    state = {
        onlineList: [],
        notiList: []
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
        socket.on('online', data => {
            var onlineList = this.state.onlineList;
            var index = onlineList.findIndex(user => user._id === data._id);
            if(index>-1){
                onlineList[index].time = Date.now();
            }
            else{
                data.time = Date.now();
                onlineList.push(data);
            }
            this.setState({onlineList});
        });
        socket.on('offline', data => {
            var onlineList = this.state.onlineList;
            var index = onlineList.findIndex(user => user._id === data._id);
            if(index>-1){
                this.setState({onlineList: this.state.onlineList.slice(0, index).concat(this.state.onlineList.slice(index + 1))});
        }
        });
        socket.on('noti', data => {
            this.setState({notiList: this.state.notiList.slice(-19).concat(data)});
        })
        this.checkOnlineUser();
    }
    checkOnlineUser = () =>{
        socket.emit('online', 'online')
        var onlineListTemp = [];
        this.state.onlineList.map(user => {
            if(user.time > Date.now() - 180000){
                onlineListTemp.push(user);
            }
        });
        this.setState({onlineList: onlineListTemp});
        setTimeout(this.checkOnlineUser, 30000);
    }
  render() {
    return (
        <div className="rightContainer">
            <div className="rightFollow">
                <div className="online">
                    <div className="title">
                        Đang Online
                    </div>
                    <div className="onContainer">
                        {this.state.onlineList.map(user => {
                            return(
                                <div className="onUser" key={user._id}>  
                                    <div className="onUsername">
                                        <a href={origin + "/profile/" + user._id}>{user.username}</a>
                                    </div>
                                    {this.props.user && user._id !== this.props.user._id ?
                                        <MessageButton className="onInbox" Text="Nhắn tin"
                                            to={{_id: user._id, username: user.username}}
                                        />
                                    : ""
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="notification">
                    <div className="title">
                        Thông báo
                    </div>
                    <div className="notiContainer">
                        {this.state.notiList.map((noti, index) => {
                            return(
                                <div className="notiLine" key={index}>
                                    <a href={origin + "/profile/" + noti._id}>
                                        <span className="notiUsername">
                                            {noti.username}
                                        </span>
                                    </a>
                                    <span className="notiStick"> {noti.string}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
  }
}