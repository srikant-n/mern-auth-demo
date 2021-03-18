import React from "react";
import { getGoogleSignIn } from "../api";
import { GoogleIcon } from "../icons";

function GoogleSignIn() {
  function onClick(event: any) {
    getGoogleSignIn((error, data) => {
        if(data) {
            window.open(data.url, "_parent");
        }
    })
  }
  return <GoogleIcon onClick={onClick} />;
}

export default GoogleSignIn;
