import React, { Component } from 'react';
import axios from '../../axios';
import origin from '../../origin';
import time from '../../time';
import MessageButton from '../Message/MessageButton';
import FormButton from '../Form/FormButton';

export default class BasicInfo extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            friendString: ["Kết bạn", "Xóa yêu cầu", "Bạn bè", "Chấp nhận"],
            friendly: -1,
            follow: 0
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if((nextProps.userId)&&(!prevState.userId)){
            var friendly = nextProps.member.relation.friends.find(friend => {
                return (friend.friend._id === nextProps.userId) || (friend.friend === nextProps.userId);
            });
            var friendCreated = Date.now();
            if(friendly){
                friendCreated = friendly.updatedAt;
                friendly = friendly.friendship;
            }
            else friendly = -1;
            var follow = nextProps.member.relation.fans.find(fan => {
                return fan._id === nextProps.userId;
            });
            return({
                userId: nextProps.userId,
                friendly: friendly,
                follow: follow,
                friendCreated: time.get(friendCreated)[1]
            });
        }
        else return (null)
      }
    _HandleShowAdvance = (field) => {
        this.setState({onShow: field});
    }
    _HandleChangeFriend = () => {
        if(this.props.userId){
            var type = ['addfriend',  'unfriend', 'unfriend', 'acceptfriend'];
            var data = {type: type[this.state.friendly + 1], to: this.props.member._id};
            axios.put('/profile/relation', data)
            .then(response => {
                if(response.data){
                    if(response.data.success){
                        var friendly = this.state.friendly;
                        switch(friendly){
                            case(-1): friendly = 0; break;
                            case(0): friendly = -1; break;
                            case(1): friendly = -1; break;
                            case(2): friendly = 1; break;
                        }
                        this.setState({
                            friendly: friendly,
                            friendCreated: time.get(Date.now())[1]
                        });
                    }
                }
            }).catch(err => {
                console.log(err)
            });
        }
        else{
            document.getElementById('login').click();
        }
    }
    _HandleChangeFollow = () => {
        if(this.props.userId){
            var data = {type: this.state.follow ? 'unfollow' : 'addfollow', to: this.props.member._id};
            axios.put('/profile/relation', data)
            .then(response => {
                if(response.data){
                    if(response.data.success){
                        this.setState({
                            follow: !this.state.follow,
                        });
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        }
        else{
            document.getElementById('login').click();
        }
    }
  render() {
    return (
        <div className="relationship">
            {this.state.friendly === 1 ?
                <div className="selectRelation hiddenSelect" onMouseEnter={()=>{this._HandleShowAdvance('friend');}} onMouseLeave={()=>{this._HandleShowAdvance();}}>
                    <div>
                        {this.state.friendString[this.state.friendly + 1]}
                    </div>
                    {this.state.onShow === 'friend' ?
                        <div className="advanceRelation">
                            <div className="timeRelation">
                                {this.state.friendCreated != 'Vừa xong' ? "Đã trở thành bạn bè từ " + this.state.friendCreated : "Vừa trở thành bạn bè"}
                            </div>
                            <div className="unRelation" onClick={this._HandleChangeFriend}>
                                Hủy kết bạn
                            </div>
                        </div>
                    :""
                    }
                </div>
            :
                <div className="selectRelation" onClick={this._HandleChangeFriend}>
                    <div>
                        {this.state.friendString[this.state.friendly + 1]}
                    </div>
                </div>
            }
            {this.state.follow ?
                <div className="selectRelation hiddenSelect" onMouseEnter={()=>{this._HandleShowAdvance('follow');}}  onMouseLeave={()=>{this._HandleShowAdvance()}}>
                    <div>Đang theo dõi</div>
                    {this.state.onShow === 'follow' ?
                        <div className="advanceRelation">
                            <div className="unRelation" onClick={this._HandleChangeFollow}>
                                Bỏ theo dõi
                            </div>
                        </div>
                    :""
                    }
                </div>
            :
                <div className="selectRelation" onClick={this._HandleChangeFollow}>
                    <div>
                        Theo dõi
                    </div>
                </div>
             }
            {this.props.userId ?
                <MessageButton className="selectRelation" Text="Nhắn tin"
                    to={{_id: this.props.member._id, username: this.props.member.username}}
                />
            :
                <FormButton className="selectRelation" Text="Nhắn tin" formType='login' />
            }
        </div>
    );
  }
}