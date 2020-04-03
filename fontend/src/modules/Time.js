import React, {Component} from 'react';
import time from '../time'


export default class Time extends Component {
    state = {
        reset: true
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        const that = this;
        if(this.props.value === 3){
            setInterval(function(){
                that.setState({
                    reset: !this.state.reset
                })
            }, 60000)
        }
    }

  render() {
      var createdAt = time.get(this.props.createdAt);
    return (
        this.state.reset ?
            <span className={this.props.className} title={createdAt[this.props.title || 0]}>
                {createdAt[this.props.value || 0]}
            </span>
        : 
            <span className={this.props.className} title={createdAt[this.props.title || 0]}>
                {createdAt[this.props.value || 0]}
            </span>
    );
  }
}