const Cookie = {
setSessionCookie(session:string){
    const expiry = (new Date(Date.now()+ 7 * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = `session=${session}; expires= ${expiry}; path=/`;
},
deleteSessionCookie(){
    const expiry = (new Date(Date.now()- 7 * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = `session=s; expires= ${expiry}; path=/`;
},
getSessionCookie():string {
return this.getCookie("session");
},
getCookie(cname:string):string{
    const name = cname + "=";
  const cookies = document.cookie.split(';');
  for(let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    // remove empty space
    while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}
};

export default Cookie;