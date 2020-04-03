import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from './axios';

import './App.css';

import NavBar from './modules/Navbar';
import MessageContainer from './modules/Message/MessageContainer';
import Home from './components/Home';
import Profile from './components/Profile';
import Post from './components/Post';
import ErrorPage from './components/ErrorPage';
import RightContiner from './modules/RightContainer';
import Title from './modules/Title';
import Sound from './sound';
import FormContainer from './modules/Form/FormContainer';
import Search from './components/Search';

var defaultState = {
  title: "Trang8",
  conversationOnShowList: {},
  newMessage: [],
  conversations: [],
  request: [],
  sound: false,
  showForm: false
}
var reducer = (state = defaultState, action) => {
  var newState = {...state};
  switch(action.type){
    case('UPDATE_TITLE'): {
      newState.title = action.title;
      return newState;
    }
    case('OPEN_CONVERSATION'): {
      newState.conversationOnShowList = {
        ...newState.conversationOnShowList,
        [action.to._id]: {to: action.to, onShow: true, focus: action.focus}};
      if(action.newMessage){
        var indexNew = newState.newMessage.findIndex(id => id === action.to._id)
        if(indexNew  === -1){
            newState.newMessage.push(action.to._id);
          }
      }
      return newState;
    }
    case('CLOSE_CONVERSATION'): {
      newState.conversationOnShowList = {
        ...newState.conversationOnShowList,
        [action.to._id]: {to: action.to, onShow: false, focus: false}};
      return newState;
    }
    case('CREATE_CONVERSATIONS'): {
      newState.conversations = action.conversations;
      newState.newMessage = action.newMessage;
      return newState;
    }
    case('UPDATE_CONVERSATIONS'): {
      var index = newState.conversations.findIndex(con => con.conversation._id === action.conversation._id);
      if(action.newMessage){
        if(index > -1){
          newState.conversations = [
            {
              to: action.to,
              conversation: action.conversation
            }
          ].concat(newState.conversations.slice(0, index)
          .concat(newState.conversations.slice(index + 1)));
        }
        else{
          newState.conversations = [
            {
              to: action.to,
              conversation: action.conversation
            }
          ].concat(newState.conversations.slice(index));
        }
        var indexNew = newState.newMessage.findIndex(id => id === action.to._id)
        if(indexNew  === -1){
            newState.newMessage = newState.newMessage.concat([action.to._id]);
            
            Sound.play();

          }
      }
      else{
        var newConversation = newState.conversations;
        newConversation[index] = 
          {
            to: action.to,
            conversation: action.conversation
          }
        newState.conversations = newConversation;
      }
      return newState;
    }
    case('READ_MESSAGE'): {
      var indexCon = newState.conversations.findIndex(con => con.to._id === action.to._id);
      if(indexCon >= 0){
        newState.conversations = newState.conversations.slice(0, indexCon).concat([{
          ...newState.conversations[indexCon],
          conversation: {
            ...newState.conversations[indexCon].conversation,
            leader: {
              ...newState.conversations[indexCon].conversation.leader,
              seen: action.time
            },
            member: {
              ...newState.conversations[indexCon].conversation.member,
              seen: action.time
            }
          },
        }]).concat(newState.conversations.slice(indexCon + 1));
      }
      var indexNew = newState.newMessage.findIndex(id => id === action.to._id)
      if(indexNew >= 0){
        newState.newMessage = newState.newMessage.slice(0, indexNew).concat(newState.newMessage.slice(indexNew + 1))
      }
      return newState;
    }
    case('UPDATE_RELATIONS'): {
      if(action.newRequest && newState.sound){
        Sound.play();
      }
      newState.sound = true;
      newState.request = action.request;
      return newState;
    }
    case('SHOW_FORM'): {
      newState.showForm = action.form;
      return newState;
    }
    default: {
      return state;
    }
  }
};

let store = createStore(reducer);

class App extends Component {
  state = {
  }
  constructor(props){
    super(props);
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    axios.get("/user/userinfo")
    .then(response => {
      if(response.data){
        this.setState({user: response.data});
      }
    }).catch(error => {
      console.log(error);
    });
  }
  render() {
    return (
      <Provider store={store}>
        <Title />
        <NavBar user={this.state.user} />
        {this.state.user ?
          <MessageContainer user={this.state.user} />
        : ""
        }
        <FormContainer />
        <div className="container">
          <Router>
              <Switch>
                <Route path="/profile/:id" render={(routerData) => 
                  <Profile memberId={routerData.match.params.id} user={this.state.user} />}
                />
                <Route path="/post/:id" render={(routerData) =>
                  <Post postId={routerData.match.params.id} user={this.state.user}/>}
                />
                <Route path="/search/:q" render={(routerData) =>
                  <Search q={routerData.match.params.q} user={this.state.user} />}
                />
                <Route path="/:id">
                  <ErrorPage />
                </Route>
                <Route path="/">
                  <Home user={this.state.user}/>
                </Route>
              </Switch>
          </Router>
          <RightContiner user={this.state.user} />
        </div>
      </Provider>
    );
  }
}

export default App;
