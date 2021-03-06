import React, {
  Fragment
} from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import Landing from './components/landing/Landing'
import MyNavbar from './components/landing/Navbar'
import Mortgage from './components/mortgage/Mortgage'
import Preview from './components/mortgage/Preview'
import PaymentLoan from './components/payments/PaymentLoan'
import PaymentScheduler from './components/payments/PaymentScheduler'
import { history } from "../src/components/helpers/history"
import Config from './components/Config/Config'
import SignIn from './components/Login/SignIn'
import UserManagament from './components/UserManagament/UserManagament'
import axios from 'axios'
import { Data, firebaseConfig } from './config'
import * as firebase from "firebase/app";
import 'firebase/storage';



firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();

class App extends React.Component {
  state = {
    auth : {
      authentication : false,
      username : null,
      userrole : null
    }
  }

  componentWillMount() {
    let auth = localStorage.getItem("Auth");
    if(auth){
      this.setState({
        auth : JSON.parse(auth)
      })
    }
  }

  handleSignin = (state) => {
    console.log("-----in handleSignin",state)
    this.checkUserAuthentication(state.username)
    
  }

  checkUserAuthentication = (username)=> {
      axios.get(`${Data.url}/user?username=${username}`)
      .then(res => {
          console.log("gettingUserAuthData data", res);
          if(res.status === 200 && res.data.length == 1){
            this.setState({
              auth:{
                authentication : true,
                username: username,
                userrole :"ADMIN"
              }
            },
            ()=> localStorage.setItem("Auth", JSON.stringify(this.state.auth))
            )
          }else{
            alert("Username incorrect")
          }
      })
      .catch(e => {
          window.alert("Login Error")
      });
  }

  handleLogout = () => {
    this.setState({
      auth:{
        authentication : false,
        username: null,
        userrole : null
      }
    },
    ()=>localStorage.removeItem("Auth")
    )
  }


  componentWillUnmount(){
    // document.cookie = JSON.stringify(this.state.auth);
  }

  render(){
    let routes = null
    if(!this.state.auth.authentication){
      return(
        <div className="signin">
          <SignIn handleSignin={(userName)=>this.handleSignin(userName)}/>
        </div>
        
      )
    }else {
      routes = (
          <div>
            <Route exact path='/' render={() => <MyNavbar handleLogout={this.handleLogout}> <Landing /></MyNavbar>} />
            <Route path='/mortgage' render={() => <MyNavbar handleLogout={this.handleLogout}> <Mortgage storageRef={storageRef}/></MyNavbar>} />
            <Route exact path='/Preview' render={() => <MyNavbar handleLogout={this.handleLogout}> <Preview /></MyNavbar>} />
            <Route exact path='/paymentLoan' render={() => <MyNavbar handleLogout={this.handleLogout}> <PaymentLoan storageRef={storageRef}/></MyNavbar>} />
            <Route exact path='/paymentScheduler' render={() => <MyNavbar handleLogout={this.handleLogout}> <PaymentScheduler /></MyNavbar>} />
            <Route exact path='/config' render={() => <MyNavbar handleLogout={this.handleLogout}> <Config /></MyNavbar>} />
            <Route exact path='/usermanagement' render={() => <MyNavbar handleLogout={this.handleLogout}> <UserManagament /></MyNavbar>} />
          </div>
      )
    }

    return (
      <Router history={history}>
        <Fragment>
          <Switch>
            {routes}
          </Switch>
        </Fragment>
      </Router>
    )
  }
}

export default App;