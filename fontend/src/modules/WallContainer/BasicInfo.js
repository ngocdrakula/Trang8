import React, { Component } from 'react';
import axios from '../../axios';
import origin from '../../origin';
import time from '../../time';
import RelationshipBar from './RelationshipBar';

export default class BasicInfo extends Component {
    constructor(props){
        super(props);
        var infoList = {
            name: {title: "Tên thật", placeholder: "Tên thật của bạn"},
            email: {title: "Email", placeholder: "Email đăng kí"},
            sex: {title: "Giới tính", placeholder: "Giới tính", sexString: ["", "Nam", "Nữ", "Khác"]},
            birthday: {title: "Sinh nhật", placeholder: "Ngày sinh của bạn"},
            country: {title: "Quê hương", placeholder: "Bạn sinh ra ở dâu?"},
            live: {title: "Nơi sống", placeholder: "Bạn đang sống ở đâu?"}
        }
        Object.keys(infoList).map(key => {
            infoList[key].originValue = this.props.member[key] || "";
            infoList[key].newValue = infoList[key].originValue
        });
        this.state = {
            infoList: infoList
        };
    }
    _HandleChangeInfo = (e) => {
        var infoList = this.state.infoList;
        infoList[e.target.name].newValue = e.target.value
        this.setState({infoList: infoList});
    }
    updateInfo = (e) => {
        e.preventDefault();
        var data = {};
        var infoList = Object.assign({}, this.state.infoList);
        Object.keys(infoList).map(key => {
            data[key] = infoList[key].newValue;
        });
        axios.put('/profile/userinfo', data)
        .then(response => {
            if(response.data){
                if(response.data.success){
                    Object.keys(infoList).map(key => {
                        infoList[key].originValue = infoList[key].newValue;
                    })
                    this.setState({
                        onChange: !this.state.onChange,
                        infoList: infoList
                    });
                }
                
            }
        }).catch(err => {
            console.log(err)
        })
    }
    changeInfo = () => {
        this.setState({
            onChange: !this.state.onChange
        })
    }
  render() {
    return (
        <div className="basicInfo">
            {this.props.member._id !== this.props.userId ?
                <RelationshipBar member={this.props.member} userId={this.props.userId} />
            : ""
            }
            <div className="title">
                Thông tin
            </div>
            {this.state.onChange ?
                <div className="infoList">
                    <form action="/" onSubmit={this.updateInfo}>
                        {Object.keys(this.state.infoList).map((key) => {
                            let item = this.state.infoList[key];
                            if(key !== 'email'){
                                return(
                                    <div className="infoLine" key={key}>
                                        <div className="infoBox">
                                            {item.title}:
                                        </div>
                                        <div className="input">
                                            {key === 'sex' ?
                                                <select name="sex"
                                                    defaultValue={item.originValue || 0}
                                                    title={item.placeholder}
                                                    onChange={this._HandleChangeInfo}>
                                                    <option value={0}>Chọn</option>
                                                    <option value={1}>Nam</option>
                                                    <option value={2}>Nữ</option>
                                                    <option value={3}>Khác</option>
                                                </select>
                                            :
                                                <input name={key}
                                                    type={key === 'birthday' ? "date" : "text"}
                                                    placeholder={item.placeholder}
                                                    defaultValue={key === 'birthday' ? time.format(item.originValue, "YYYY-MM-DD") : item.originValue || ""}
                                                    onChange={this._HandleChangeInfo} />
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        })
                        }
                        <div className="infoLine">
                            <div className="infoBox cancel" onClick={this.changeInfo}>
                                Hủy
                            </div>
                            <div className="input submit">
                                <input type="submit" value="Chấp nhận" />
                            </div>
                        </div>
                    </form>
                </div>
            :
                <div className="infoList">
                    {Object.keys(this.state.infoList).map(key => {
                        let item = this.state.infoList[key];
                        if(item.originValue && item.originValue != "0")
                            return(
                            <div className="infoLine" key={key}>
                                <div className="infoBox">
                                    {item.title + ": " + (key === 'birthday' ? time.format(item.originValue, "DD/MM/YYYY")
                                                        :
                                                         key ==='sex' ? item.sexString[item.originValue] : item.originValue)}
                                </div>
                            </div>
                        )
                    })}
                    {this.props.member._id === this.props.userId ?
                        <div className="infoLine" onClick={this.changeInfo}>
                            <div className="infoBox changeInfo">
                                Chỉnh sửa thông tin cá nhân
                            </div>
                        </div>
                    :""
                    }
                </div>
            }
        </div>
    );
  }
}