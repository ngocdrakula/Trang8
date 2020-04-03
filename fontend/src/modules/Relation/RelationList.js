import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios';
import socket from '../../socket';
import origin from '../../origin';
import Time from '../Time';

class RelationList extends Component {
  constructor(props){
    super(props);
    this.state = {
      onShow: false,
      myRequest: [],
      request: []
    }
  }
  componentDidMount(){
    this.checkingRequest('request');
    socket.on(this.props.user._id, data => {
      if(data.type === 'request' || data.type === 'myRequest'){
        this.checkingRequest();
      }
    })
  }
  handleShowForm = (onShow) => {
    this.setState({
      onShow: onShow
    })
  }
  checkingRequest = (onShow) => {
    axios.get('/profile/relation/')
    .then(response => {
      if(response.data && response.data.success){
        var request = [];
        var myRequest = [];
        response.data.data.friends.map(friend => {
          if(friend.friendship === 0){
            request.push(friend);
          }
          else if(friend.friendship === 2){
            myRequest.push(friend)
          }
        });
        request = request.reverse();
        myRequest = myRequest.reverse();
        this.props.dispatch({
          type: 'UPDATE_RELATIONS',
          request: request,
          newRequest: (onShow && request.length > this.state.request.length)
        });
        this.setState({
          onShow: onShow || this.state.onShow,
          myRequest: myRequest,
          request: request
        })
      }
    }).catch(err => {
      console.log(err);
    });
  }
  _HandleRequestAction = (type, action, index) => {
    var data = {
      type: action,
      to: this.state[type][index].friend._id
    }
    axios.put('/profile/relation', data)
    .then(response => {
        if(response.data && response.data.success){

        }
    }).catch(err => {
        console.log(err)
    });
  }
  render() {
    return(
      <div className={this.props.onShow ? "requestContainer" : "hidden"}>
        {this.state.onShow ? 
          <div className="requestNumberContainer">
            {this.state.request.length ?
              <div className="requestNumber link" onClick={() => {this.handleShowForm('request')}}>
                Yêu cầu kết bạn ({this.state.request.length})
              </div>
            :
              <div className="requestNumber">
                Yêu cầu kết bạn
              </div>
            }
            {this.state.myRequest.length ?
              <div className="requestNumber link" onClick={() => {this.handleShowForm('myRequest')}}>
                Đã gửi ({this.state.myRequest.length})
              </div>
            :
              <div className="requestNumber">
                Đã gửi
              </div>
            }
          </div>  
        : 
          "Đang tải..."
        }
        {this.state.onShow === "request" ?
          <div className="requestList">
            {this.state.request.map((friend, index) => {
              return(
                  <div className="requestLine" key={index}>
                    <div className="requestAvatar">
                      <a href={"/profile/" + friend.friend._id}>
                        <img src={origin + "/image/avatar/" + friend.friend._id} />
                      </a>
                    </div>
                    <div className="requestInfo">
                      <div className="requestUser">
                        <a href={"/profile/" + friend.friend._id}>
                          {friend.friend.username}
                        </a>
                      </div>
                      <div className="requestAction">
                        <div className="requestAccept" onClick={() => {this._HandleRequestAction('request', 'acceptfriend', index)}}>
                          Chấp nhận
                        </div>
                      <div className="requestDelete" onClick={() => {this._HandleRequestAction('request', 'unfriend', index)}}>
                        Xóa
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        :
        this.state.onShow === 'myRequest' ?
          <div className="requestList">
            {this.state.myRequest.map((friend, index) => {
              return(
                <div className="requestLine" key={index}>
                  <div className="requestAvatar">
                    <a href={"/profile/" + friend.friend._id}>
                      <img src={origin + "/image/avatar/" + friend.friend._id} />
                    </a>
                  </div>
                    <div className="requestInfo">
                      <div className="requestAction">
                        <div className="requestUser">
                          <a href={"/profile/" + friend.friend._id}>
                            {friend.friend.username}
                          </a>
                        </div>
                      <div className="requestDelete" onClick={() => {this._HandleRequestAction('myRequest', 'unfriend', index)}}>
                        Xóa
                      </div>
                    </div>
                    <div className="requestTime textover">
                      {"Đã gửi từ: "}
                      <Time createdAt={friend.updatedAt} value="1" title="2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        :""
        }
      </div>
    );
  }
}

export default connect((state) => ({}))(RelationList);