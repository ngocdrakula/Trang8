import React, { Component } from 'react';
import axios from '../axios'
import PostContainer from './PostContainer/PostContainer';
import StatusForm from './PostContainer/StatusForm';

export default class News extends Component {
    state = {
        last: Date.now(),
        order: 0,
        postLists: [],
        getFeed: true
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.newsFeed();
        const news = this;
        document.addEventListener('scroll', function(){
            if(document.documentElement.scrollHeight - window.pageYOffset < window.innerHeight + 200 && news.state.getFeed){
                news.newsFeed();
            }
        });
    }
    newsFeed = () => {
        this.setState({getFeed: false});
        var url = `/post/news?order=${this.state.order}&time=${this.state.last}`;
        if(this.props.member) url += `&id=${this.props.member._id}`;
        axios.get(url)
        .then(response => {
            if(response.data){
                var newPostLists = [];
                response.data.map(post => {
                    if(this.state.postLists.findIndex(postId => {return postId._id === post._id}) === -1){
                        newPostLists.push(post);
                    }
                });
                this.setState(preState => ({
                    postLists: [...preState.postLists, ...newPostLists],
                    order: preState.order + 5,
                    last: Date.now(),
                    getFeed: true
                }));
            }
        }).catch(error => {
          console.log(error);
        });
    }

  render() {
    return (
        <div>
            <StatusForm member={this.props.member} user={this.props.user} />
            {this.state.postLists.map(post => {
                return(
                    <PostContainer key={post._id} post={post} user={this.props.user} />
                )
            })}
            {this.state.postLists.length ?
                <div className="bottomNews">
                    <div className="loadNews">
                        {this.props.member ? `Hiển thị thêm` : `Xem thêm tin`}
                    </div>
                </div>
                : ""}
        </div>
    );
  }
}