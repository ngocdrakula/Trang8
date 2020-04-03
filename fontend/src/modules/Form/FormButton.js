import React, { Component } from 'react';
import { connect } from 'react-redux';


class FormButton extends Component {
  changeForm = (formType) => {
    this.props.dispatch({
      type: 'SHOW_FORM',
      form: formType
    });
    if(this.props.callback){
      console.log(formType)
      this.props.callback();
    }
  }
  render() {
    return(
      <div className={this.props.className || ""} onClick={() => {this.changeForm(this.props.formType)}}>
          {this.props.Text || this.props.children}
      </div>
    );
  }
}

export default connect()(FormButton);