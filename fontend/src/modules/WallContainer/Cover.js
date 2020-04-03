import React, { Component } from 'react';
import axios from '../../axios';
import origin from '../../origin';

import Avatar from './Avatar'

export default class Cover extends Component {
    state = {
        xMouse: 0,
        yMouse: 0
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
       this.resetAdjustCover();
    }
    changeCover = () => {
        this.resetAdjustCover(true);
    }
    adjustCover = (e) => {
        var files = e.target.files;
        var that = this;
        if(files[0]){
            var reader = new FileReader();
            reader.onload = function(){
                var image = new Image();
                image.src = reader.result;
                image.onload = function() {
                    var size = {};
                    var sizeRate = (this.width * 250 / this.height / 625);
                    if(sizeRate > 1){
                        size.height = 250;
                        size.width = 625 * sizeRate;
                    }
                    else{
                        size.width = 625;
                        size.height = 250  / sizeRate;
                    }
                    that.setState({
                        style: {
                            backgroundImage: "url('" + reader.result + "')",
                            backgroundPositionX: "0px",
                            backgroundPositionY: "0px"
                        },
                        size: size,
                        newCover: files[0]
                    });
                    }
                }
            reader.readAsDataURL(files[0]);
        }
        else{
            this.resetAdjustCover(true);
        }
    }
    resetAdjustCover = (onChange) => {
        var style = {};
        var size = {}
        if(this.props.member){
            if(this.props.member.cover.origin){
                style = {
                    backgroundImage: "url('" + origin + "/photo/" + this.props.member.cover.origin.image + "')",
                    backgroundPositionX: this.props.member.cover.position.x + "px",
                    backgroundPositionY: this.props.member.cover.position.y + "px"
                };
                size = Object.assign({}, this.props.member.cover.size);
            }
        }
        this.setState({
            style: style,
            size: size,
            newCover: false,
            onChange: onChange
        });
    }
    changePosition = (e) => {
        var style = Object.assign({}, this.state.style);
        var size = Object.assign({}, this.state.size);
        if(e.buttons === 1){
            var diffX = (e.clientX - this.state.xMouse) * 2;
            var diffY = (e.clientY - this.state.yMouse) * 2;
            var backgroundPositionX = parseInt(style.backgroundPositionX) + diffX;
            var backgroundPositionY = parseInt(style.backgroundPositionY) + diffY;
            if(size.height === 250 && backgroundPositionX > 625 - size.width && backgroundPositionX < 0){
                style.backgroundPositionX = backgroundPositionX + diffX + 'px';
            }
            if(size.width === 625 && backgroundPositionY > 250 - size.height && backgroundPositionY < 0){
                style.backgroundPositionY = backgroundPositionY + 'px';
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
    uploadCover = (e) => {
        e.preventDefault();
        var dataImage = new FormData();
        var infoImage = {
            cover: {
                size: this.state.size,
                position: {
                    x: parseInt(this.state.style.backgroundPositionX),
                    y: parseInt(this.state.style.backgroundPositionY)
                },
            }
        }
        dataImage.append('privacy', 3);
        dataImage.append('status', "");
        dataImage.append('infoData', JSON.stringify(infoImage));
        if(this.state.newCover){
            dataImage.append('file', this.state.newCover);
        }
        console.log(this.state.newCover)
        axios.post('/post', dataImage)
        .then(response => {
            console.log(response.data)
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
        this.resetAdjustCover(false)
    }
    _HandleShowImage = (e) => {
        if((!e || e.target.className === 'imageContainer') && this.props.member.cover.origin){
            this.setState({imageOnShow: !this.state.imageOnShow});
        }
    }
    
  render() {
      return (
        <div className="cover" style={this.state.style} onClick={this._HandleShowImage}>
            {this.state.onChange ?
                <div className="editCover">
                    <div className="adjustCover" onMouseMove={this.changePosition}>
                    </div>
                    <form className="formUploadCover" onSubmit={this.uploadCover}>
                        <div className="accept">
                            <div className="form-group">
                                <div className="uploadPhoto">
                                <input type="file" name="photo" id="selectCover" accept="image/x-png,image/jpeg" onChange={this.adjustCover} />
                                <label className="input" htmlFor="selectCover">
                                    Chọn ảnh khác
                                </label>
                            </div>
                            </div>
                            <div className="form-group">
                                <div className="cancel" onClick={this.closeEdit}>
                                    Hủy
                                </div>
                                <div className="input">
                                    <input type="submit" value="Thay đổi" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            :
                <div className="imageContainer">
                    {this.props.member._id === this.props.userId ?
                        <div className="changeCover">
                            <div className="changeCoverButton" onClick={this.changeCover}>
                                Đổi ảnh bìa
                            </div>
                        </div>
                    : ""
                    }
                    <Avatar userId={this.props.userId} member={this.props.member} />
                    <div className="usernameBox">
                        <div className="username">
                            {this.props.member.username}
                        </div>
                    </div>
                </div>
            }
            {this.state.imageOnShow ?
                <div className="showForm" onClick={(e)=> {if(e.target.className === 'showForm'){this._HandleShowImage()}}}>
                    <div className="photoViewContainer">
                        <div className="photoViewBox">
                            <div className="photoViewItem">
                                <img src={origin + "/photo/" + this.props.member.cover.origin.image} />
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