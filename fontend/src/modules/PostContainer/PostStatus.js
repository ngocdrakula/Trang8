import React, { Component } from 'react';
import origin from '../../origin';


export default class PostStatus extends Component {
    state = {
        status: []
    };
    constructor(props){
        super(props);
        this.state = {
            status: []
        }
    }
    componentDidMount(){
        var status = this.props.status; var seemore = 0; var large = "";
        if(status.length < 200 && status.split("\n").length < 6 && !this.props.image){
            large = "large";
        }
        else if(status.length>500){
            status = status.slice(0, 500);
            seemore = 1;
        }
        else if(status.split("\n").length>10){
            seemore = 1;
        }
        this.setState({
            status: status.split("\n").slice(0,10),
            large: large,
            seemore: seemore
        })
    }
    seeAll = () => {
        this.setState({
            status: this.props.status.split("\n"),
            seemore: 0
        })
    }
    _HandleShowImage = () => {
        this.setState({imageOnShow: !this.state.imageOnShow})
    }

  render() {
    return (
        <div className="newsStatus">
            <div className="newsContent">
                <div className={this.state.large}>
                    {this.state.status.map((text, line) => {
                        return(
                            <span key={line}>
                                {text}
                                {line < this.state.status.length - 1 ? <br /> : ""}
                            </span>
                        );
                    })}
                    {this.state.seemore ? 
                        <span className="link" onClick={this.seeAll}>... Xem thêm</span>
                        : ""
                    }
                </div>
            </div>
            {this.props.image ?
                <div className="newsPhotoContainer">
                    <div className="newsPhoto">
                        <img src={origin + "/photo/" + this.props.image} onClick={this._HandleShowImage} />
                    </div>
                </div>
                : ""}
            {this.state.imageOnShow ?
                <div className="showForm" onClick={(e)=> {if(e.target.className === 'showForm'){this._HandleShowImage()}}}>
                    <div className="photoViewContainer">
                        <div className="photoViewBox">
                            <div className="photoViewItem">
                                <img src={origin + "/photo/" + this.props.image} />
                            </div>
                        </div>
                        <div className="closeButton" title="Đóng" onClick={() => {this._HandleShowImage()}}>
                            X
                        </div>
                    </div>
                </div>
            : ""  
            }
        </div>
    );
  }
}