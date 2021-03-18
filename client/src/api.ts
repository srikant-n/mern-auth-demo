import UserData from "./UserData";

function post(
  url: string,
  data: object,
  callback: (error: any, data?: any) => void
): Promise<void> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        // throw new Error(response.statusText);
        throw response.statusText;
      }
      return response.json();
    })
    .then((data) => callback(null, data))
    .catch((error) => callback(error, undefined));
}

/**
 * Login using email and password
 * @param email Entered email
 * @param password Entered password
 * @param callback Data from server
 */
export function login(
  email: string,
  password: string,
  callback: (error: any, user?: UserData) => void
): void {
  post("/user/login", { email, password }, callback);
}

/**
 * Register using email and password
 * @param email Entered email
 * @param password Entered password
 * @param callback Data from server
 */
export function register(
  email: string,
  password: string,
  callback: (error: any, user?: UserData) => void
): void {
  post("/user/register", { email, password }, callback);
}

/**
 * Update profile data
 * @param userData Updated user data
 * @param callback Data from server
 */
export function updateProfile(
  userData: UserData,
  callback: (error: any, user?: UserData) => void
): void {
  post("/user/update", userData, callback);
}

/**
 * Upload an image and get the url for it
 * @param id User's ID
 * @param file File to upload
 * @param callback Url from server
 */
export function uploadImage(id: string, file: any, callback: (error: any, url?: string) => void) {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("image", file);
  // Upload selected file to server
  fetch("/user/image", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      // Check for error
      if (!res.ok) {
        throw Error(res.statusText);
      }
      // Get text from response
      return res.text();
    })
    .then((url) => {
      // URL obtained
      callback(null, url);
    })
    .catch((error) => {
      // Error uploading
      callback(error, undefined);
    });
}

// Session
/**
 * Create and get a session id
 * @param userId User's id to create session for
 * @param callback Session ID
 */
export function getSessionId(userId: string, callback: (error: any, sessionId: string) => void) {
  post("/user/session/register", { id: userId }, callback);
}

/**
 * Login using session id
 * @param session Session ID for fetching
 * @param callback UserData
 */
export function loginWithSession(session: string, callback: (error: any, user?: UserData) => void) {
  post("/user/session/login", { session: session }, callback);
}

/**
 * Login or register using google
 * @param id ID from google sign in
 * @param callback UserData from server
 */
export function loginWithGoogle(token:string, callback: (error: any, user?: UserData) => void) {
  // post("/user/google", {"id":id, user:userData} , callback);
  fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`).then(res => res.json()).then(data => {
  const userData = {name:data.name, email:data.email, photo:data.picture};
  post("/user/google", {id:data.sub, user:userData} , callback);
}).catch(error => console.log(error));
}
// export function loginWithGoogle(id: string, userData:UserData, callback: (error: any, user?: UserData) => void) {
//   // post("/user/google", {"id":id, user:userData} , callback);
//   post("/user/google", {"id":id, user:userData} , callback);
// }

export function logoutGoogle(callback:() => any) {
  // sign out google
  const  auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    callback();
  });
}

export function getGoogleSignIn(callback :(error: any, data?:{url:string})=>void){
  fetch("/google")
    .then((response) => {
      if (!response.ok) {
        // throw new Error(response.statusText);
        throw response.statusText;
      }
      return response.json();
    })
    .then((data) => callback(null, data))
    .catch((error) => callback(error, undefined));
}
