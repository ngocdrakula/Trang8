import React, { Component } from 'react';

export default class ChildComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    onChange = (e) => {
        this.props.onChange(this.props.index, e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
  render() {
    return (
        <div className="">
            <input onChange={this.onChange} value={this.props.name || ""} name="name" />
            <input onChange={this.onChange} value={this.props.email || ""} name="email" />
            <button onClick={()=> {this.props.add(this.props.index)}}>Add</button>
            <button onClick={()=> {this.props.del(this.props.index)}}>Del</button>
        </div>
    );
  }
}