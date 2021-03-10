import React from "react";
import { Link } from "react-router-dom";
import UserData from "../UserData";

function LoginOrRegister(props: {
  isLogin: boolean;
  pathToToggleLogin?: string;
  onLogin: (user: UserData) => any;
}) {
  return <div />;
}

export default LoginOrRegister;
