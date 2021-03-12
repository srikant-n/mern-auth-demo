import React, { useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import "./App.css";
import LoginOrRegister from "./components/LoginOrRegister";
import Profile from "./components/Profile";
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

  function onLogin(userData?: UserData) {
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
          <Redirect to="/login" />
          {/* <Profile user={dummyUser} onUpdateUser={setUser} /> */}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
