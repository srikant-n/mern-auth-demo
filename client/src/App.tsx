import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { getSessionId, loginWithSession } from "./api";
import "./App.css";
import LoginOrRegister from "./components/LoginOrRegister";
import Profile from "./components/Profile";
import Cookie from "./cookie";
import { Logo } from "./icons";
import UserData from "./UserData";

function App() {
  const [user, setUser] = useState<UserData | undefined>(undefined);
  const history = useHistory();
  const dummyUser = {
    id: "0",
    name: "Nameth",
    photo: "https://avatars.githubusercontent.com/u/17551928?s=460&v=4",
    email: "test@me.com",
  };

  useEffect(()=>{
    // loginWithSession(Cookie.getSessionCookie(), onSessionLogin);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  function onSessionLogin(error:any, userData?:UserData):void {
    if(userData) {
      saveLoginUser(userData!);
    } else {
      history.push("/login");
    } 
  }

  function onLogin(userData: UserData, saveCookie:boolean) {
    if(saveCookie) {
      getSessionId(userData?.id!, (error, sessionId) => {
        !error && Cookie.setSessionCookie(sessionId);
      });
    }
    saveLoginUser(userData);
  }

  function saveLoginUser(userData: UserData) {
    setUser(userData);
    history.push("/profile");
  }

  return (
    <div>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/login">
          <LoginOrRegister isLogin={true} pathToToggleLogin="/register" onLogin={onLogin} />
        </Route>
        <Route path="/register">
          <LoginOrRegister isLogin={false} pathToToggleLogin="/login" onLogin={onLogin} />
        </Route>
        <Route path="/profile">
          {user ? <Profile user={user} onUpdateUser={setUser} /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/">
          {/* <Logo className="App-logo" /> */}
          <Profile user={dummyUser} onUpdateUser={setUser} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
