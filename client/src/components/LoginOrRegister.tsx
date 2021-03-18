import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login, loginWithGoogle, register } from "../api";
import { EmailIcon, Logo, PasswordIcon } from "../icons";
import UserData from "../UserData";
import Footer from "./Footer";
import GoogleSignIn from "./GoogleSignIn";
import "./LoginOrRegister.css";

function LoginOrRegister(props: {
  isLogin: boolean;
  pathToToggleLogin?: string;
  onLogin: (user: UserData, saveCookie:boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Login/Register form submitted
   * @param event
   * @returns
   */
  function submitLoginOrRegister(event: any): void {
    event.preventDefault();
    if (requestSent) {
      return;
    }

    setRequestSent(true);
    if (props.isLogin) {
      login(email, password, onLogin);
    } else {
      register(email, password, onLogin);
    }
  }

  /**
   * Response for login/register received from server
   * @param error Error from server if any
   * @param user User data from server if no error
   */
  function onLogin(error: any, user?: UserData): void {
    setRequestSent(false);
    if (error) {
      setErrorMessage(error);
    } else {
      props.onLogin(user!, true);
    }
  }

  function onGoogleSignIn(googleUser:any):void {
    const profile = googleUser.getBasicProfile();
    const user = {id:profile.getId(), name:profile.getName(), photo:profile.getImageUrl(), email:profile.getEmail()};
    // const id_token = googleUser.getAuthResponse().id_token;
    loginWithGoogle(profile.getId(), user, (error, userData)=>{
      if(userData) {
        props.onLogin(userData, false);
      }
    });

    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }
  

  /**
   * @returns Component to display with link to toggle between login and register
   */
  function getToggleComponent() {
    return props.isLogin ? (
      <p className="centered-small">
        Not a member? <Link className="page-toggle" to={props.pathToToggleLogin!}>Register</Link>
      </p>
    ) : (
      <p className="centered-small">
        Already a member? <Link className="page-toggle" to={props.pathToToggleLogin!}>Login</Link>
      </p>
    );
  }

  return (
    <div>
      <div className="container">
        <Logo />
        <h3>Join thousands of learners from around the world</h3>
        <p>
          Master web development by making real-life projects. There are multiple paths for you to
          choose
        </p>
        <form onSubmit={submitLoginOrRegister}>
          <div className="login-form-element">
            <label htmlFor="email" aria-label="Email">
              <EmailIcon className="icon" />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="login-form-element">
            <label htmlFor="password" aria-label="Email">
              <PasswordIcon className="icon" />
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <p className="error">{errorMessage}</p>
          <input type="submit" value={props.isLogin ? "Login" : "Register"} aria-label="Login" />
        </form>
        <p className="centered-small">or continue with</p>
        <div className="social-group">
        {/* <div className="g-signin2" data-onsuccess="onGoogleSignIn" /> */}
        {/* <div className="g-signin2" data-onsuccess="onGoogleSignIn" /> */}
        <GoogleSignIn onLogin={onGoogleSignIn} />

          {/* <GoogleIcon className="social-button" />
          <FacebookIcon className="social-button" />
          <GithubIcon className="social-button" /> */}
        </div>
        {getToggleComponent()}
        <Footer />
      </div>
      
    </div>
  );
}

export default LoginOrRegister;
