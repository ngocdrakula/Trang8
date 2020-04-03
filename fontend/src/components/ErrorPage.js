import React, { Component } from 'react';

export default class ErrorPage extends Component {
    state = {
    };
    constructor(props){
        super(props);
    }
  render() {
    return (
      <div  className="news">
        Trang bạn đang truy cập không tồn tại. 
        Vui lòng tìm thử tải lại trang
      </div>
      );
  }
}