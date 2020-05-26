import React, { Component } from 'react';

import ChildComponent from './ChildComponent.js';

export default class Parent extends Component {
    constructor(props){
        super(props);
        this.state = {
            array: [{
                name: "",
                email: ""
            }]
        }
    }
    add = (index) => {
        this.setState({
            array: ((this.state.array.slice(0, index + 1)).concat([{}])).concat(this.state.array.slice(index + 1))
        })
    }
    del = (index) => {
        this.setState({
            array: this.state.array.slice(0, index).concat(this.state.array.slice(index + 1))
        })
    }
    onChange = (index, field, value) => {
        var array = this.state.array;
        array[index][field] = value;
        this.setState({
            array: array
        })
    }
  render() {
      console.log(this.state.array)
    return (
        <div className="">
            {this.state.array.map((child, index) => {
                return(
                    <ChildComponent
                        key={index}
                        index={index}
                        name={child.name}
                        email={child.email}
                        add={this.add}
                        del={this.del}
                        onChange={this.onChange}
                        />
                )
            })}
        </div>
    );
  }
}