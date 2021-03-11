import UserData from "./UserData";

function post(
  url: string,
  data: object,
  callback: (error: any, user?: UserData) => void
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
        throw new Error(response.statusText);
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
