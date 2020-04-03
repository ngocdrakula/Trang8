import React, { Component } from 'react';
import origin from '../origin'

import MessageIconNoti from './Message/MessageIconNoti';
import ConversationList from './Message/ConversationList';
import RelationIconNoti from './Relation/RelationIconNoti';
import RelationList from './Relation/RelationList';
import FormButton from './Form/FormButton';


export default class NavBar extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
    _HandleShowForm = (type) => {
        this.setState({
            formOpen: type === this.state.formOpen || type
        })
    }
    _HandleChangeInput = (e) => {
        if(e){
            var data = {};
            data[e.target.name] = e.target.value;
            this.setState(data);
        }
    }
    _HandleSubmitSearch = (e) => {
        e.preventDefault();
        if(this.state.q){
            window.open('/search/' + this.state.q, "_self")
        }
    }
  render() {
      if(this.props.user){
        return (
            <div className="taskbar">
                <div className="navbar">
                    <div className="home">
                        <div className="logo">
                            <a href="/">
                                <img src={origin + "/IMG/logo.PNG"} alt="Trang chủ" />
                            </a>
                        </div>
                        <form className="searchContainer" action="/search" method="get" onSubmit={this._HandleSubmitSearch} >
                            <input type="text" name="q" placeholder="Bạn đang tìm gì?" onChange={this._HandleChangeInput}/>
                            {this.state.q?
                                <input type="submit" value="Tìm" />
                            : ""
                            }
                        </form>
                    </div>
                    <div className="user">
                        <div className="buttonLink textover" title="Trang cá nhân">
                            <div className="link first textover">
                                <a href={"/profile/" + this.props.user._id}>
                                    {this.props.user.username}
                                </a>
                            </div>
                        </div>
                        <div className="buttonLink notiBox" onClick={() => {this._HandleShowForm('inbox')}}>
                            <div className="link">Tin nhắn</div>
                            <MessageIconNoti />
                        </div>
                        <div className="buttonLink notiBox" onClick={() => {this._HandleShowForm('request')}}>
                            <div className="link">Bạn bè</div>
                            <RelationIconNoti />
                        </div>
                        <div className="setting buttonLink">
                            <div className={(this.state.formOpen === 'setting' ? "shownButton" : "showButton") + " link"}
                                onClick={() => {this._HandleShowForm('setting')}}>
                                    Tùy chọn
                            </div>
                            {this.state.formOpen === 'setting' ?
                                <div className="settingContainer">
                                    <div className="flange">
                                        <div className="junction"> </div>
                                    </div>
                                    <div className="settingList">
                                        <div className="settingLine">
                                            <a href="/help">Hỗ trợ / Báo cáo</a>
                                        </div>
                                        <div className="settingLine">
                                            <a href="/setting">Cài đặt riêng tư</a>
                                        </div>
                                        <FormButton className="settingLine" Text="Đăng xuất" formType='logout' callback={this._HandleShowForm} />
                                    </div>
                                </div>
                            :''}
                        </div>
                        <ConversationList user={this.props.user} onShow={this.state.formOpen === 'inbox'} selectConversation={this._HandleShowForm}/>
                        <RelationList user={this.props.user} onShow={this.state.formOpen === 'request'} />
                    </div>
                </div>
            </div>
        );
      }
      else{
        return (
            <div className="taskbar">
                <div className="navbar">
                    <div className="home">
                        <div className="logo">
                            <a href="/">
                                <img src={origin + "/IMG/logo.PNG"} alt="Trang chủ" />
                            </a>
                        </div>
                        <form className="searchContainer" action="/search" method="get" onSubmit={this._HandleSubmitSearch} >
                            <input type="text" name="q" placeholder="Bạn đang tìm gì?" onChange={this._HandleChangeInput}/>
                            {this.state.q?
                                <input type="submit" value="Tìm" />
                            : ""
                            }
                        </form>
                        <div >
                        </div>
                    </div>
                    <div className="user">
                        <div className="buttonLink">
                            <FormButton className="link first" Text="Đăng nhập" formType="login" />
                        </div>
                        <div className="buttonLink">
                            <FormButton className="link" Text="Đăng ký" formType="register" />
                        </div>
                        <div className="buttonLink">
                            <div className="link">
                            <a href="/celebrityButton">Trang</a>
                            </div>
                        </div>
                        <div className="buttonLink">
                            <div className="link">
                                <a href="/help">Trợ giúp</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      }
  }
}