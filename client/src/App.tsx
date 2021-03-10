import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import LoginOrRegister from "./components/LoginOrRegister";
import Profile from "./components/Profile";
import UserData from "./UserData";

function App() {
  const [user, setUser] = useState<UserData | undefined>(undefined);

  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <LoginOrRegister isLogin={true} pathToToggleLogin="/register" onLogin={setUser} />
          </Route>
          <Route path="/register">
            <LoginOrRegister isLogin={false} pathToToggleLogin="/login" onLogin={setUser} />
          </Route>
          <Route path="/profile">
            {user ? <Profile user={user} onUpdateUser={setUser} /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;