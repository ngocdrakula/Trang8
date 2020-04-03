import React, { Component } from 'react';
import axios from '../../axios';

export default class LoginForm extends Component {
    state = {
    }
    
    constructor(props){
        super(props);
    }
    inputChange = (e) => {
        var data = {};
        data[e.target.name] = e.target.value;
        if(e.target.name === 'rules') data.rules = !this.state.rules;
        this.setState(data);
    }
    formSubmit = (e) => {
        e.preventDefault();
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))){
            this.setState({
                key: 0,
                warnMessage: 'Email không hợp lệ!'
            })
        }
        else if(this.state.password !== this.state.repassword){
            this.setState({
                key: 3,
                warnMessage: 'Xác nhận mật khẩu không chính xác'
            })
        }
        else{
            axios.post('/user/register', this.state)
            .then(response => {
                if(response.data.success){
                    window.location.reload();
                }
                else{
                    console.log(response.data)
                    this.setState({key: response.data.key, warnMessage: response.data.err});
                }
            })
            .catch(err => {
                console.log(err)
            });
        }
    }
    render() {
        return (
            <div className="userForm register">
                <form onSubmit={this.formSubmit}>
                    <div className="form-title">
                        Đăng kí Tài khoản
                    </div>
                    {this.state.key === 0 ? <div className="caution">{this.state.warnMessage}</div> : ""}
                    <div className="form-group">
                        <div className="input-title">
                            Email:
                        </div>
                        <div className="input">
                            <input name="email" onChange={this.inputChange} type="text" placeholder="Nhập Email của bạn" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-title">
                            Tên bạn:
                        </div>
                        <div className="input">
                            <input name="name" onChange={this.inputChange} type="text" placeholder="Nhập tên đầy đủ" required />
                        </div>
                    </div>
                    {this.state.key === 2 ? <div className="caution">{this.state.warnMessage}</div> : ""}
                    <div className="form-group">
                        <div className="input-title">
                            Nickname:
                        </div>
                        <div className="input">
                            <input name="username" onChange={this.inputChange} type="text" placeholder="Tên tài khoản" maxLength="13" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-title">
                            Mật khẩu:
                        </div>
                        <div className="input">
                            <input name="password" onChange={this.inputChange} type="password" placeholder="Mật khẩu của bạn" minLength="8"  required />
                        </div>
                    </div>
                    {this.state.key === 3 ? <div className="caution">{this.state.warnMessage}</div> : ""}
                    <div className="form-group">
                        <div className="input-title">
                            Xác nhận mật khẩu:
                        </div>
                        <div className="input">
                            <input name="repassword" onChange={this.inputChange} type="password" placeholder="Xác nhận mật khẩu"minLength="8"  required />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="checkbox-group">
                            <div className="checkbox-input">
                                <input nam="rules" id="rules" onChange={this.inputChange} type="checkbox" title="Đồng ý với điều khoản của Trang 8" required />
                            </div>
                            <label className="checkbox-title" htmlFor="rules">
                                Đồng ý với <a href="/rules" title="Điều khoản của Trang8">điều khoản</a>.
                            </label>
                        </div>
                        <div className="input">
                            <input type="submit" value="Đăng kí" />
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
