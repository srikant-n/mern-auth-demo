/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
function GoogleSignIn (props:{onLogin:(user:any)=>any}) {
    const GOOGLE_BUTTON_ID = "google-sign-in-button";

    useEffect(()=>{
        window.gapi.signin2.render(GOOGLE_BUTTON_ID, {
            width: 200,
            height: 50,
            onsuccess: props.onLogin
          });
    },[]);

//   function onSuccess(googleUser:any) {
//     const profile = googleUser.getBasicProfile();
//     console.log("Name: " + profile.getName());
//     props.onLogin(profile);
//   }

    return <div id={GOOGLE_BUTTON_ID} />;
}

export default GoogleSignIn;