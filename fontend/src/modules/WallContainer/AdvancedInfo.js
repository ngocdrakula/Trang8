import React, { Component } from 'react';
import axios from '../../axios';
import origin from '../../origin';
import time from '../../time';

export default class AdvancedInfo extends Component {
  state = {
  };
  constructor(props){
      super(props);
      this.state = {
        onLoad: 'none',
        postList: [],
        friends: this.props.member.relation.friends,
        fans: this.props.member.relation.fans,
        follows: this.props.member.relation.follows,
      };
      
  }
  _HandleShowRelation = (relation) => {
    if(relation === 'image' && !this.state.postList.length){
      this.setState({onLoad: 'waiting'});
      axios.get('post/image/' + this.props.member._id)
        .then(response => {
          if(response.data){
            if(response.data.success){
              this.setState({
                postList: response.data.data,
                onLoad: relation
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    else if(relation !== this.state.onLoad){
      this.setState({onLoad: relation});}
  }
  _HandleShowImage = (index) => {
    this.setState({imageOnShow: index});
  }
  render() {
    return (
      <div className="advancedInfo">
        <div className="relationInfo">
            <div className="relationButton" onClick={(e) => {this._HandleShowRelation('image')}}>
                <div className="relationText" title="Album Ảnh">
                    Ảnh
                </div>
            </div>
            <div className="relationButton" onClick={(e) => {this._HandleShowRelation('friends')}}>
                <div className="relationText" title="Danh sách bạn bè">
                    Bạn bè
                </div>
            </div>
            <div className="relationButton" onClick={(e) => {this._HandleShowRelation('fans')}}>
                <div className="relationText" title="Người theo dõi">
                    Fans
                </div>
            </div>
            <div className="relationButton" onClick={(e) => {this._HandleShowRelation('idols')}}>
                <div className="relationText" title="Đang theo dõi">
                    Idol
                </div>
            </div>
        </div>
        <div className="relationContainer">
          {{
            waiting:
              <div className="photoContainer">
                Đang tải...
              </div>,
            image:
              <div className="photoContainer">
                {this.state.postList.map((post, index) => {
                  return(
                    <div className="imageBox" key={post._id} onClick={() => {this._HandleShowImage(index)}}>
                        <div className="imageItem" style={{backgroundImage: "url('" + origin + "/photo/" + post.image +"')"}}>
                            <div className="photoTime">
                              {time.get(post.createdAt)[3]}
                              </div>
                        </div>
                    </div>
                  )
                  })}
              </div>,
            friends:
              <div className="friendsContainer">
                {this.state.friends.find(friend => friend.friendship === 1) ?
                  this.state.friends.map(friend => {
                    if(friend.friendship === 1){
                      return(
                        <div className="userInfoContainer" key={friend.friend._id}>
                            <div className="userInfoAvatar">
                                <div className="photo40">
                                    <a href={"/profile/" + friend.friend._id}>
                                        <img className="newsUserLink" src={origin + "/image/avatar/" + friend.friend._id} />
                                    </a>
                                </div>
                            </div>
                            <div className="userInfoUsername">
                                <a className="newsUsername" href={"/profile/" + friend.friend._id} title="Trang cá nhân">{friend.friend.username}</a>
                            </div>
                        </div>
                      );
                    };
                  })
                :
                  <div className="nullContainer">Không có bạn bè để hiển thị</div>
                }
              </div>,
            fans:
              <div className="fansContainer">
                {this.state.fans.length ? 
                  this.state.fans.map(fan => {
                    return(
                      <div className="userInfoContainer" key={fan._id}>
                          <div className="userInfoAvatar">
                              <div className="photo40">
                                  <a href={"/profile/" + fan._id}>
                                      <img className="newsUserLink" src={origin + "/image/avatar/" + fan._id} />
                                  </a>
                              </div>
                          </div>
                          <div className="userInfoUsername">
                              <a className="newsUsername" href={"/profile/" + fan._id} title="Trang cá nhân">{fan.username}</a>
                          </div>
                      </div>
                    );
                  })
                :
                  <div className="nullContainer">Không có người theo dõi</div>}
              </div>,
            idols:
              <div className="idolsContainer">
                { this.state.follows.length ?
                  this.state.follows.map(idol => {
                    return(
                      <div className="userInfoContainer" key={idol._id}>
                          <div className="userInfoAvatar">
                              <div className="photo40">
                                  <a href={"/profile/" + idol._id}>
                                      <img className="newsUserLink" src={origin + "/image/avatar/" + idol._id} />
                                  </a>
                              </div>
                          </div>
                          <div className="userInfoUsername">
                              <a className="newsUsername" href={"/profile/" + idol._id} title="Trang cá nhân">{idol.username}</a>
                          </div>
                      </div>
                    );})
                  :
                    <div className="nullContainer">Chưa có người để theo dõi</div>
                  }
              </div>,
            none: <div></div>
            }[this.state.onLoad]}
            {/* {this.state.onLoad !== 'none' ? 
              <div className="hiddenButton">
                <span className="link" onClick={() => {this._HandleShowRelation('none')}}>
                  Ẩn tất cả
                </span>
              </div>
            :""} */}
        </div>
        {this.state.imageOnShow > -1 ?
          <div className="showForm" onClick={(e)=> {if(e.target.className === 'showForm'){this._HandleShowImage(-1)}}}>
            <div className="photoViewContainer">
              <div className="photoViewBox">
                <div className="photoViewItem">
                  <a href={"/post/" + this.state.postList[this.state.imageOnShow]._id} title="Xem tin đầy đủ">
                    <img src={origin + "/photo/" + this.state.postList[this.state.imageOnShow].image} />
                  </a>
                </div>
              </div>
              {this.state.imageOnShow > 0 ?
                <div className="photoPagePrevious" onClick={() => {this._HandleShowImage(this.state.imageOnShow - 1)}}>
                    <div className="photoPageText">
                        {"< Trước"}
                    </div>
                </div>
              : ""
              }
              {this.state.imageOnShow < this.state.postList.length - 1 ?
                <div className="photoPageNext" onClick={() => {this._HandleShowImage(this.state.imageOnShow + 1)}}>
                    <div className="photoPageText">
                        {"Tiếp >"}
                    </div>
                </div>
              : ""
              }
              <div className="closeButton" title="Đóng" onClick={() => {this._HandleShowImage(-1)}}>
                  X
              </div>
            </div>
          </div>
        : ""  
        }
      </div>
    );
  }
}