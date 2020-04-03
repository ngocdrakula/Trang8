import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageBox from './MessageBox';
import socket from '../../socket';

class MessageContainer extends Component {
  state = {}
  constructor(props){
    super(props);
    this.state = {
    }
  }
  componentDidMount(){
    socket.on(this.props.user._id, data => {
      if(data.type === 'message'){
        this.props.dispatch({
          type: 'OPEN_CONVERSATION',
          to: data.to,
          focus: false
        });
      }
    });
  }
  render() {
    return(
      <div className="mesContainer">
        {Object.keys(this.props.conversationOnShowList).map((key, index) => {
          return(
            <MessageBox key={key} user={this.props.user}
              to={this.props.conversationOnShowList[key].to}
              onShow={this.props.conversationOnShowList[key].onShow}
              focus={this.props.conversationOnShowList[key].focus}
            />
          );
        })}
      </div>
    );
  }
}

export default connect((state => ({conversationOnShowList: state.conversationOnShowList})))( MessageContainer );