import React, { Component } from 'react';
import origin from '../../origin'
import Time from '../Time';


export default class PostHeader extends Component {
    state = {
        feelingString: ["", "hạnh phúc","tuyệt vời","vui vẻ","thú vị","hi vọng","đáng yêu","buồn","giận giữ"],
        statusType: ["", " đã thay đổi ảnh đại diện", " đã thay đổi ảnh bìa"],
        privacyString: ["", "Chỉ mình tôi", "Bạn bè", "Công khai"],
        privacyTitle: ["", "Chỉ bạn mới thấy bài đăng này", "Chia sẻ với bạn bè", "Chia sẻ với tất cả mọi người"],
    };
    constructor(props){
        super(props);
    }
  render() {
    return (
        <div className="newsInfo">
            <div className="newsUserContainer">
                <div className="newsAvatar">
                    <div className="photo">
                        <a href={"/profile/" + this.props.author._id}>
                            <img className="newsUserLink" src={origin + "/image/avatar/" + this.props.author._id}/>
                        </a>
                    </div>
                </div>
                <div className="newsUser">
                    <div className="userInfo">
                        <a className="newsUsername" href={"/profile/" + this.props.author._id}>
                            {this.props.author.username}
                        </a>
                        {!this.props.feeling || " đang cảm thấy " + this.state.feelingString[this.props.feeling]}
                        {this.props.to ?
                            <span> cùng với <a href={"/profile/" + this.props.to._id}>{this.props.to.username}</a></span>
                            : ""
                        }
                        {this.state.statusType[this.props.statusType]}
                    </div>
                    <div className="postInfo">
                        <div className="newsPrivacy" title={this.state.privacyTitle[this.props.privacy]}>
                            {this.state.privacyString[this.props.privacy]}
                        </div>
                        <div className="newsTime" title={this.state.privacyTitle[this.props.privacy]}>
                            <a href={"/post/" + this.props.postId} style={{color: 'black'}}>
                                <Time className="" title="2" value="0" createdAt={this.props.createdAt} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}