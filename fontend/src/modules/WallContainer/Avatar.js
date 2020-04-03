import React, { Component } from 'react';
import axios from '../../axios';
import origin from '../../origin';

export default class Avatar extends Component {
    state = {
        xMouse: 0,
        yMouse: 0
    };
    constructor(props){
        super(props);
    }
    changeAvatar = () => {
        this.resetAdjustAvatar();
    }
    changeCommentAvatar = (e) => {
        this.setState({status: e.target.value})
    }
    adjustAvatar = (e) => {
        var avatar = this.state.avatar;
        var style = {
            marginTop: 0,
            marginLeft: 0
        };
        var files = e.target.files;
        var that = this;
        if(files[0]){
            var reader = new FileReader();
            reader.onload = function(){
                avatar = reader.result;
                var image = new Image();
                image.src = reader.result;
                image.onload = function() {
                    style.sizeRate = (this.width / this.height);
                    if(this.height < this.width){
                        style.height = '200px';
                        style.width = (200 * style.sizeRate) + 'px';
                    }
                    else{
                        style.width = '200px';
                        style.height = (200 / style.sizeRate) + 'px';
                    }
                    that.setState({
                        avatar: avatar,
                        style: style,
                        newAvatar: files[0]
                    });
                    }
                }
            reader.readAsDataURL(files[0]);
        }
        else{
            this.resetAdjustAvatar();
        }
    }
    resetAdjustAvatar = () => {
        var avatar = origin + '/photo/no-avatar.jpg';
        var style = {
            marginTop: 0,
            marginLeft: 0,
            width: '200px',
            height: '200px',
            sizeRate: 1
        };
        if(this.props.member.avatar.origin){
            avatar = origin + '/photo/' + this.props.member.avatar.origin.image;
            style.marginTop = this.props.member.avatar.size.height + this.props.member.avatar.position.y * 2 - 200;
            style.marginLeft =  this.props.member.avatar.size.width + this.props.member.avatar.position.x * 2 - 200;
            style.width = this.props.member.avatar.size.width + 'px';
            style.height = this.props.member.avatar.size.height + 'px';
            style.sizeRate = this.props.member.avatar.size.width / this.props.member.avatar.size.height
        }
        this.setState({
            avatar: avatar,
            style: style,
            newAvatar: false,
            onChange: true
        })
    }
    changeSize = (e) => {
        var style = Object.assign({}, this.state.style);
        if(style.sizeRate > 1){
            style.height = e.target.value + 'px';
            style.width = parseInt(e.target.value * style.sizeRate) + 'px';
        }
        else{
            style.width = (e.target.value) + 'px';
            style.height = parseInt(e.target.value / style.sizeRate) + 'px';
        }
        if(Math.abs(style.marginLeft) > parseInt(style.width) - 200){
            style.marginLeft = Math.sign(style.marginLeft)*(parseInt(style.width) - 200);
        }
        if(Math.abs(style.marginTop) > parseInt(style.height) - 200){
            style.marginTop = Math.sign(style.marginTop)*(parseInt(style.height) - 200);
        }
        this.setState({style: style})
    }
    changePosition = (e) => {
        var style = Object.assign({}, this.state.style);
        if(e.buttons === 1){
            var diffX = (e.clientX - this.state.xMouse) * 2;
            var diffY = (e.clientY - this.state.yMouse) * 2;
            if(Math.abs(style.marginLeft + diffX) < parseInt(style.width) - 200){
                style.marginLeft += diffX;
            }
            if(Math.abs(style.marginTop + diffY) < parseInt(style.height) - 200){
                style.marginTop += diffY;
            }
            e.target.style.cursor = 'grabbing';
        }
        else{
            e.target.style.cursor = 'grab';
        }
        this.setState({
            style: style,
            xMouse: e.clientX,
            yMouse: e.clientY
        });
    }
    updatePosition = (e) => {
        this.setState({
            position: {
                x: e.target.offsetLeft,
                y: e.target.offsetTop
            }
        });
    }
    grabbingMouse = (e) => {
        if(e.buttons === 1){
            e.target.style.cursor = 'grabbing';
        }
        else{
            e.target.style.cursor = 'grab';
        }
    }
    uploadAvatar = (e) => {
        e.preventDefault();
        var dataImage = new FormData();
        var infoImage = {
            avatar: {
                position: this.state.position,
                size: {
                    width: parseInt(this.state.style.width),
                    height: parseInt(this.state.style.height)
                },
            }
        }
        dataImage.append('privacy', 3);
        dataImage.append('status', this.state.status || "");
        dataImage.append('infoData', JSON.stringify(infoImage));
        if(this.state.newAvatar){
            dataImage.append('file', this.state.newAvatar);
        }
        axios.post('/post', dataImage)
        .then(response => {
            if(response.data){
                if(response.data.success){
                    window.location.reload();
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }
    closeEdit = () => {
        this.setState({onChange: false})
    }
    _HandleShowImage = (e) => {
        if(!e || e.target.className === 'avatar'){
            this.setState({imageOnShow: !this.state.imageOnShow});
        }
    }
    
  render() {
    return (
        <div className="avatar" style={{backgroundImage: `url('${origin}/image/avatar/${this.props.member._id}')`}} onClick={this._HandleShowImage}>
            {this.props.member._id === this.props.userId ?
                <div className="changeAvatar" onClick={this.changeAvatar}>
                    Cập nhật
                </div>
            : ""
            }
            {this.state.onChange ? 
                <div className="showForm">
                    <div className="userForm upload">
                        <div className="form-title">Chỉnh sửa ảnh đại diện</div>
                        <form action="/" onSubmit={this.uploadAvatar}>
                            <div className="status">
                                {this.state.newAvatar ?
                                    <div className="status-textarea noteAvatar">
                                        <textarea placeholder="Hãy nói gì đó về ảnh này" onChange={this.changeCommentAvatar}></textarea>
                                    </div>
                                :
                                    <div className="status noteAvatar">
                                        <div className="extractStatus">
                                            {this.props.member.avatar.origin.status.length > 50 ? this.props.member.avatar.origin.status.slice(0, 50) + "..." : this.props.member.avatar.origin.status || <br />}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="adjustAvatar">
                                <div className="moveAvatar" onMouseMove={this.changePosition}>
                                    <div className="background">
                                        <div className="backgroundImage">
                                            <img src={this.state.avatar} style={this.state.style} draggable="false" />
                                        </div>
                                    </div>
                                    <div className="move">
                                        <div className="moveImage">
                                            <img src={this.state.avatar} style={this.state.style} draggable="false" onMouseMove={this.updatePosition} />
                                        </div>
                                    </div>
                                </div>
                                <div className="resize" key={this.state.style.sizeRate}>
                                    <input type="range" min="200" max="1200" defaultValue={Math.min(parseInt(this.state.style.width), parseInt(this.state.style.height))} onChange={this.changeSize} onMouseMove={this.grabbingMouse} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="uploadPhoto">
                                    <input type="file" name="photo" id="selectAvatar" accept="image/x-png,image/jpeg" onChange={this.adjustAvatar} />
                                    <label className="input" htmlFor="selectAvatar">
                                        Chọn ảnh khác
                                    </label>
                                </div>
                                <div className="input">
                                    <input type="submit" value="Thay đổi" />
                                </div>
                            </div>
                        </form>
                        <div className="closeButton" onClick={this.closeEdit}>
                            X
                        </div>
                    </div>
                </div>
            : ""
            }
            {this.state.imageOnShow ?
                <div className="showForm" onClick={(e)=> {if(e.target.className === 'showForm'){this._HandleShowImage()}}}>
                    <div className="photoViewContainer">
                        <div className="photoViewBox">
                            <div className="photoViewItem">
                                <img src={origin + (this.props.member.avatar.origin ? "/photo/" + this.props.member.avatar.origin.image : "/image/avatar/" + this.props.member._id)} />
                            </div>
                        </div>
                        <div className="closeButton" title="Đóng" onClick={() => {this._HandleShowImage()}}>
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