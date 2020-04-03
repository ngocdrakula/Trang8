import React, { Component } from 'react';
import axios from '../axios'



export default class LogoutForm extends Component {
    state = {
    }
    
    constructor(props){
        super(props);
    }
    logout = (e) => {
        axios.get('/user/logout')
        .then(response => {
            if(response.data)
                window.location.reload();
        })
        .catch(err => {
            console.log(err)
        })
    }
    closeForm = (e) => {
        const className = e.target.className;
        if(className === 'showForm' || className === 'closeButton'|| className === 'link'|| className === 'buttonLink'){
            this.props.close();
        }
    }
    render() {
        return (
            <div className="showForm" onClick={this.closeForm}>
                <div className="userForm logout">
                    <div className="form-title">
                        Bạn có chắc muốn đăng xuất?
                    </div>
                    <div className="form-group" style={{height:"40px"}}>
                        <div className="buttonLink" onClick={this.closeForm}>
                            <span className="link" onClick={this.closeForm} >Không, tôi muốn ở lại!</span>
                        </div>
                        <div className="buttonLink">
                            <span className="link" onClick={this.logout}><b>Đăng xuất</b></span>
                        </div>
                    </div>
                    <div className="closeButton" onClick={this.closeForm} title="Đóng">
                        X
                    </div>
                </div>
            </div>
        )
    }
}
