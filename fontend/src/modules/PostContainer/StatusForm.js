import React, { Component } from 'react';
import axios from '../../axios';
import origin from '../../origin';
import FormButton from '../Form/FormButton';
import PostContainer from './PostContainer';



export default class StatusForm extends Component {
    state = {
    }
    
    constructor(props){
        super(props);
        this.state = {
            status: '',
            listPosted: []
        }
    }
    inputChange = (e) => {
        if(e.target.name === 'status'){
            e.target.style.height = "50px";
            e.target.style.height = (e.target.scrollHeight - 22) + "px";
            if(this.state.status.split('').length > 100 || this.state.status.split('\n').length > 10){
                e.target.style.fontSize = '16px';
            }
            else{
                e.target.style.fontSize = '24px';
            }
        }
        var data = {};
        data[e.target.name] = e.target.value;
        this.setState(data);
    }
    imageChange = (e) => {
        const scope = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = new Image();
            image.src = reader.result;
            image.onload = function() {
                var style = {};
                if(this.width>this.height){
                    style.height = "60px";
                }
                else{
                    style.width = "60px";
                }
                scope.setState({
                    image: {
                        style: style,
                        src: reader.result
                    }
                })
            }
        };
        var files = e.target.files;
        if(!files[0]){
            e.target.value = '';
            this.setState({
                image: false
            })
        }
        else{
            reader.readAsDataURL(files[0]);
        }
    }
    deleteImages = () => {
        document.getElementById('photo').value = '';
        this.setState({
            image: null
        })
    }
    formSubmit = (e) => {
        console.log('alo')
        e.preventDefault();
        var data = new FormData();
        data.append('file', document.getElementById('photo').files[0]);
        data.append('status', this.state.status || '');
        data.append('privacy', this.state.privacy || 3);
        data.append('feeling', this.state.feeling || '');
        if(this.props.member) data.append('to', this.props.member._id);
        axios.post('/post', data)
        .then(response => {
            console.log(response.data)
            if(response.data.success){
                this.setState({
                    status: '',
                    privacy: '',
                    feeling: '',
                    image: '',
                    listPosted: [response.data.data].concat(this.state.listPosted)
                })
            }
            else{

            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
            <div>
                <div className="statusForm">
                    <form onSubmit={this.formSubmit}>
                        <div className="form-group">
                            <div className="select-title">
                                Bạn đang cảm thấy thế nào? 
                            </div>
                            <div className="feeling-select">
                                <select name="feeling" onChange={this.inputChange} value={this.state.feeling || 0}>
                                    <option value="0">Chọn</option>
                                    <option value="1">Hạnh phúc</option>
                                    <option value="2">Tuyệt vời</option>
                                    <option value="3">Vui vẻ</option>
                                    <option value="4">Thú vị</option>
                                    <option value="5">Hi vọng</option>
                                    <option value="6">Cô đơn</option>
                                    <option value="7">Buồn</option>
                                    <option value="8">Giận giữ</option>
                                </select>
                            </div>
                        </div>
                        {this.props.user ?
                            <div className="status">
                                <div className="status-avatar">
                                    <a href={"/profile/" + this.props.user._id}>
                                        <img src={origin + "/api/image/avatar"} />
                                    </a>
                                </div>
                                <div className="status-textarea">
                                    <textarea name="status" onChange={this.inputChange} value={this.state.status || ''}
                                        placeholder={(this.props.member && this.props.member._id !== this.props.user._id) ?
                                                "Nói với " + this.props.member.username + " rằng bạn đã ở đây"
                                            : "Bạn đang nghĩ gì?"
                                            }>
                                    </textarea>
                                </div>
                            </div>
                        : 
                            <FormButton formType='login' className="status">
                                <div className="status-avatar">
                                    <img src={origin + "/api/image/avatar"} className="link" />
                                </div>
                                <div className="status-textarea">
                                        <textarea name="status" placeholder={this.props.member ?
                                                "Nói với " + this.props.member.username + " rằng bạn đã ở đây"
                                            : "Bạn đang nghĩ gì?"
                                            }
                                        >
                                        </textarea>
                                </div>
                            </FormButton>
                        }
                        {this.state.image ?
                            <div className="previewContainer">
                                <div className="previewItem">
                                    <div className="previewPhoto">
                                        <img style={this.state.image.style} src={this.state.image.src} title="Ảnh tải lên" />
                                    </div>
                                    <div className="deleteItem" onClick={this.deleteImages} title="Xóa">
                                        X
                                    </div>
                                </div>
                            </div>
                            : ''}
                        
                        <div className="form-group">
                            <div className="uploadPhoto">
                                <input name="photo" onChange={this.imageChange} id="photo" type="file" accept="image/x-png,image/jpeg" />
                                <label className="input" htmlFor="photo">
                                    {this.state.image ? "Chọn ảnh khác" : "Thêm ảnh"}
                                </label>
                            </div>
                            <div className="input">
                                <select name="privacy" onChange={this.inputChange} value={this.state.privacy || 3}>
                                    <option value="3">Công khai</option>
                                    <option value="2">Bạn bè</option>
                                    <option value="1">Chỉ mình tôi</option>
                                </select>
                                <input type="submit" value="Chia sẻ" />
                            </div>
                        </div>
                    </form>
                </div>
                {this.state.listPosted.map((post, key) => {
                    return(
                        <PostContainer key={key} post={post} user={this.props.user} />
                    );
                })}
            </div>
        )
    }
}
