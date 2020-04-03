import React, { Component } from 'react';
import axios from '../axios';
import Cover from './WallContainer/Cover';
import BasicInfo from './WallContainer/BasicInfo';
import AdvancedInfo from './WallContainer/AdvancedInfo';

export default class Wall extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
  render() {
    return (
        <div className="wall">
            <Cover userId={this.props.userId} member={this.props.member} />
            <div className="infomation">
                <BasicInfo member={this.props.member} userId={this.props.userId} />
                <AdvancedInfo member={this.props.member} userId={this.props.userId} />
            </div>
        </div>
    );
  }
}