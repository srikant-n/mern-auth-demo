import React, { useState } from "react";
import { useHistory } from "react-router";
import { updateProfile } from "../../api";
import Cookie from "../../cookie";
import { Logo, CameraIcon } from "../../icons";
import UserData from "../../UserData";
import ChangePhotoModal from "./ChangePhotoModal";
import "./Profile.css";
import UserMenu from "./UserMenu";

function Profile(props: { user: UserData; onUpdateUser: (user: UserData) => any }) {
  const [userData, setUserData] = useState<UserData | undefined>(props.user);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
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
   * Open change photo modal
   */
  function openPhotoModal(): void {
    setShowPhotoModal(true);
  }

  /**
   * Photo changed
   * @param url New photo url
   */
  function onChangePhoto(url?: string): void {
    setShowPhotoModal(false);
    setUserData((state) => {
      return Object.assign({}, state, { photo: url });
    });
  }

  /**
   * Edit button clicked
   * @param event
   */
  function onClickEdit(event: any): void {
    setIsEditable(true);
  }

  /**
   * Submit button clicked
   * @param event
   */
  function onClickSubmit(event: any): void {
    event.preventDefault();
    updateProfile(userData!, (error, user?) => {
      if (error) {
        setErrorMessage("Failed to update. Please try again.");
      } else {
        setUserData(user!);
        props.onUpdateUser(user!);
        setIsEditable(false);
      }
    });
  }

  /**
   * Get Text input for form
   * @param name Input name and label
   * @param value Input field value
   * @returns Form item component
   */
  function textInput(name: string, value?: string) {
    return (
      <div className="profile-item">
        <label className="profile-label" htmlFor={name}>
          {name}
        </label>
        <input
          type="text"
          className="input"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChangeValue}
          readOnly={!isEditable}
        />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header>
        <Logo />
        <img className="photo" src={userData!.photo} alt="User" onClick={()=>setShowUserMenu(true)} />
      </header>
      <div className="page-info">
        <h2>Personal info</h2>
        <p>Basic info, like your name and photo</p>
      </div>
      <form className="profile-form" onSubmit={onClickSubmit}>
        <div className="profile-header">
          <div className="profile-info">
            <h2>Profile</h2>
            <p>Some info may be visible to other people</p>
          </div>
          <input
            className={"profile-button" + (isEditable ? "" : " display-none")}
            type="submit"
            name="save"
            value="Save"
            onClick={onClickSubmit}
          />
          <input
            className={"profile-button" + (isEditable ? " display-none" : "")}
            type="button"
            name="edit"
            value="Edit"
            onClick={onClickEdit}
          />
        </div>
        <p className="error">{errorMessage}</p>
        <div className="profile">
          <div className="profile-item">
            <label className="profile-label" htmlFor="photo">
              Photo
            </label>
            <div className="photo-container">
              <img id="photo" className="photo" src={userData!.photo} alt="User" />
              {isEditable && (
                <CameraIcon
                  className="photo-edit"
                  aria-label="Change photo"
                  onClick={openPhotoModal}
                />
              )}
            </div>
          </div>
          <hr />
          {textInput("name", userData?.name)}
          <hr />
          <div className="profile-item">
            <label className="profile-label" htmlFor="bio">
              Bio
            </label>
            {/* Show textarea only while editable */}
            {isEditable ? (
              <textarea
                className="input"
                id="bio"
                name="bio"
                rows={4}
                value={userData?.bio}
                onChange={onChangeValue}
              />
            ) : (
              <p>{userData?.bio}</p>
            )}
          </div>
          <hr />
          {textInput("phone", userData?.phone)}
          <hr />
          {textInput("email", userData?.email)}
          <hr />
          <div className="profile-item">
            <label className="profile-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="input"
              id="password"
              name="password"
              minLength={6}
              placeholder="******"
              value={userData?.password}
              onChange={onChangeValue}
              readOnly={!isEditable}
            />
          </div>
          <hr />
        </div>
      </form>
      <ChangePhotoModal
        isVisible={showPhotoModal}
        id={userData!.id}
        photo={userData?.photo}
        onClose={onChangePhoto}
      />
      <UserMenu isVisible={showUserMenu} onClickMenuItem={onClickMenuItem} onClose={() => setShowUserMenu(false)} />
    </div>
  );
}

export default Profile;
