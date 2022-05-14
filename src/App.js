import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import VechileList from "./components/vechile/vechile-list.component";
import DriverList from "./components/driver/driver-list.component";
import OwnerList from "./components/owner/owner-list.component";
import UserList from "./components/user/user-list.component";
import BoardAdmin from "./components/board-admin.component";


// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      showOperatorBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
   
    const user = AuthService.getCurrentUser();
    
    if (user) {
    
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_DISPATCHER"),
        showOperatorBoard: user.roles.includes("ROLE_OPERATOR"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      showOperatorBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
         
          <div className="navbar-nav mr-auto">
            {showAdminBoard && (
              <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>  
              <li className="nav-item">
                <Link to={"/vechile-list"} className="nav-link">
                  Vechiles
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/driver-list"} className="nav-link">
                  Drivers
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/owner-list"} className="nav-link">
                  Owners
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/user-list"} className="nav-link">
                  Users
                </Link>
              </li>
             
              <li className="nav-item">
               <Link to={"/register"} className="nav-link">
                Register
               </Link>
              </li>
              </div>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            
          </div>

          {currentUser && (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) }
        </nav>

        <div className="container-fluid border py-3 my-3">
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/vechile-list" component={VechileList} />
            <Route path="/driver-list" component={DriverList} />
            <Route path="/owner-list" component={OwnerList} />
            <Route path="/user-list" component={UserList} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/home" component={Home} />
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}

export default App;
