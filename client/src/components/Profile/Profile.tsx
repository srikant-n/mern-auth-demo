import React, { useState } from "react";
import { useHistory } from "react-router";
import { updateProfile } from "../../api";
import Cookie from "../../cookie";
import { Logo } from "../../icons";
import UserData from "../../UserData";
import Footer from "../Footer";
import "./Profile.css";
import ProfileEdit from "./ProfileEdit";
import ProfileView from "./ProfileView";
import UserMenu from "./UserMenu";

function Profile(props: { user: UserData; onUpdateUser: (user?: UserData) => any }) {
  const [userData, setUserData] = useState<UserData | undefined>(props.user);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const history = useHistory();

  function onClickMenuItem(item: string): void {
    setShowUserMenu(false);
    switch (item) {
      case "profile":
        history.push("/profile");
        break;
      case "logout":
        Cookie.deleteSessionCookie();
        history.push("/login");
        break;
    }
  }
  /**
   * Input value changed
   * @param event
   */
  function onChangeValue(event: any): void {
    setUserData((state) => {
      return Object.assign({}, state, { [event.target.name]: event.target.value });
    });
  }

  /**
   * Photo changed
   * @param url New photo url
   */
  function onChangePhoto(url?: string): void {
    setUserData((state) => {
      return Object.assign({}, state, { photo: url });
    });
  }

  /**
   * Edit button clicked
   */
  function onClickEdit(): void {
    setIsEditable(true);
  }

  /**
   * Profile edited and saved
   * @param user Updated user data
   */
  function onSave(user?:UserData): void {
    if(user) {
      setUserData(user!);
        props.onUpdateUser(user!);
    }
    setIsEditable(false);
  }

  return (
    <div className="profile-page">
      <header>
        <Logo />
        <div className="user-menu-button" onClick={() => setShowUserMenu(true)}>
          <img
            className="photo"
            src={userData!.photo}
            alt="User"
          />
          {showUserMenu ? <p>&#9660;</p> : <p>&#9650;</p>}
        </div>
      </header>
      {isEditable ? <ProfileView user={userData!} onClickEdit={onClickEdit} /> : <ProfileEdit user={userData!}  onSave={onSave} />}
      <UserMenu
        isVisible={showUserMenu}
        onClickMenuItem={onClickMenuItem}
        onClose={() => setShowUserMenu(false)}
      />
    </div>
  );
}

export default Profile;
