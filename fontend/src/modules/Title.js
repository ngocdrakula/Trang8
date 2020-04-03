import React, { Component } from 'react';
import { connect } from 'react-redux';



class Title extends Component {
  constructor(props){
    super(props);
    this.state = {
      notiNumber: this.props.newMessage.length + this.props.request.length
    }
  }
  componentDidMount(){
    if(this.props.input){
      this.props.dispatch({
        type: 'UPDATE_TITLE',
        title: this.props.input
      });
    }
    else{
      document.title = this.props.title;
      const that = this;
      var showNoti;
      (function reload(){
        if(that.state.notiNumber){
          if(showNoti){
            document.title = `(${that.state.notiNumber}) ${that.props.title}`;
          }
          else{
            document.title = that.props.title;
          }
          showNoti = !showNoti;
        }
        else{
          document.title = that.props.title;
        }
        setTimeout(reload, 2000);
      })();
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!nextProps.input && !prevState.input){
      var notiNumber = nextProps.newMessage.length + nextProps.request.length;
      if(notiNumber != prevState){
        return({notiNumber: notiNumber});
      }
    }
    return(null)
  }
  render() {
    return(
      <div />
    );
  }
}

export default connect((state => ({
  newMessage: state.newMessage,
  request: state.request,
  title: state.title
})))(Title);