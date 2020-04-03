import React, { Component } from 'react';
import axios from '../../axios'



export default class LoginForm extends Component {
    state = {
    }
    
    constructor(props){
        super(props);
    }
    inputChange = (e) => {
        var data = {};
        data[e.target.name] = e.target.value;
        if(e.target.name === 'remember') data.remember = !this.state.remember;
        this.setState(data);
    }
    formSubmit = (e) => {
        e.preventDefault();
        var data = {
            password: this.state.password,
            remember: this.state.remember
        }
        if(this.state.account.split("@")[1]){
            data.email = this.state.account;
        }
        else data.username = this.state.account;
        axios.post('/user/login', data)
        .then(response => {
            if(response.data.success)
                window.location.reload();
            else{
                this.setState({key: response.data.key, warnMessage: response.data.err});
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
            <div className="userForm login">
                <form onSubmit={this.formSubmit}>
                    <div className="form-title">
                        Đăng nhập vào Trang8
                    </div>
                    {this.state.key === 0 ? <div className="caution">{this.state.warnMessage}</div> : ""}
                    <div className="form-group">
                        <div className="input-title">
                            Tài khoản:
                        </div>
                        <div className="input">
                            <input name="account" onChange={this.inputChange} type="text" placeholder="Nickname hoặc email" required />
                        </div>
                    </div>
                    {this.state.key ? <div className="caution">{this.state.warnMessage}</div> : ""}
                    <div className="form-group">
                        <div className="input-title">
                            Mật khẩu:
                        </div>
                        <div className="input">
                            <input name="password" onChange={this.inputChange} type="password" placeholder="Mật khẩu của bạn" minLength="8" required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="checkbox-group">
                            <div className="checkbox-input">
                                <input id="remember" name="remember" onChange={this.inputChange} type="checkbox" title="Ghi nhớ đăng nhập" />
                            </div>
                            <label className="checkbox-title" htmlFor="remember">
                                Ghi nhớ
                            </label>
                        </div>
                        <div className="input">
                            <input type="submit" value="Đăng nhập" />
                        </div>
                    </div>
                    <div className="closeButton" title="Đóng" onClick={this.props.close}>
                        X
                    </div>
                </form>
            </div>
        )
    }
}
