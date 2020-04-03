import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LogoutForm from './LogoutForm';


class FormContainer extends Component {
  _HandleCloseForm = () => {
    this.props.dispatch({
      type: 'SHOW_FORM',
      form: false
    })
  }
  _HandleOverForm = (e) => {
    if(e.target.className === 'showForm')
      this._HandleCloseForm();
  }
  render() {
    return(
      <div className={this.props.showForm ? "showForm" : ""} onClick={this._HandleOverForm}>
        {this.props.showForm === 'login' ?
          <LoginForm close={this._HandleCloseForm} />
          :
          this.props.showForm === 'register' ?
            <RegisterForm close={this._HandleCloseForm} />
            :
            this.props.showForm === 'logout' ?
              <LogoutForm close={this._HandleCloseForm} />
              :
              <div />
            
        }
      </div>
      );
  }
}

export default connect((state => ({showForm: state.showForm})))(FormContainer);