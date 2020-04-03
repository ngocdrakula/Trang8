import React, { Component } from 'react';
import axios from '../axios';

import News from '../modules/News';
import Wall from '../modules/Wall';
import Title from '../modules/Title';
import ErrorPage from './ErrorPage';

export default class Profile extends Component {
    state = {
    };
    constructor(props){
        super(props);
        this.state = {
          waiting: true
        }
    }
    componentDidMount(){
      axios('/profile/' + this.props.memberId)
      .then(response => {
        if(response.data){
          if(response.data.success){
            this.setState({
              member: response.data.data,
              waiting: false
            });
          }
          else{
            console.log(response.data.err)
          }
        }
      })
    }
  render() {
    if(this.state.waiting){
      return(
        <div className="news">
        </div>
      )
    }
    else if(this.state.member){
      return (
            <div  className="news">
              <Title input={this.state.member.username} />
              <Wall userId={this.props.user ? this.props.user._id : null} member={this.state.member}/>
              <News user={this.props.user} member={this.state.member}/>
            </div>
      );
    }
    else{
      return(
        <ErrorPage />
      )
    }
  }
}