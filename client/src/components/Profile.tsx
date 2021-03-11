import React, { useEffect, useState } from "react";
import { updateProfile } from "../api";
import { Logo } from "../images";
import UserData from "../UserData";
import ChangePhotoModal from "./ChangePhotoModal";

function Profile(props: { user: UserData; onUpdateUser: (user: UserData) => any }) {
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [password, setPassword] = useState<string>("");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  useEffect(() => {
    setUserData(props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onChangeValue(event: any): void {
    setUserData((state) => {
      return Object.assign({}, state, { [event.target.name]: event.target.value });
    });
  }

  function changePhoto(): void {
    setShowPhotoModal(true);
  }

  function onChangePhoto(url:string):void {
    setShowPhotoModal(false);
    setUserData(state =>{
      return Object.assign({}, state, {photo:url});
    });
  }

  function onClickEdit(event: any): void {
    setIsEditable(true);
  }

  function onClickSubmit(event: any): void {
    event.preventDefault();
    updateProfile(userData!, (error, user?)=>{
      if(error) {
        setErrorMessage(error);
      } else {
        setUserData(user!);
        setIsEditable(false);
      }
    });
  }

  function saveEditButton() {
    return isEditable ? (
      <input type="submit" name="save" value="Save" onClick={onClickSubmit} />
    ) : (
      <input type="button" name="edit" value="Edit" onClick={onClickEdit} />
    );
  }

  return (
    <div className="container">
      <header>
        <Logo />
        <img className="photo-small" src={props.user.photo} alt="User" />
      </header>
      <div className="page-info">
        <h1>Personal info</h1>
        <p>Basic info, like your name and photo</p>
      </div>
      <form onSubmit={onClickSubmit}>
        <div className="profile-header">
          <div className="profile-info">
            <h1>Personal info</h1>
            <p>Some info may be visible to other people</p>
          </div>
          {saveEditButton()}
          {/* <button className="edit" onClick={onClickEdit}>Edit</button>
        <button className="save" onClick={onClickSubmit}>Edit</button> */}
        </div>
        <p className="error">{errorMessage}</p>
        <div className="profile">
          <div className="profile-item">
            <label className="profile-label" htmlFor="photo">
              Photo
            </label>
            <img id="photo" src={props.user.photo} alt="User" onClick={changePhoto} />
          </div>
          <div className="profile-item">
            <label className="profile-label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData?.name}
              onChange={onChangeValue}
              readOnly={!isEditable}
            />
          </div>
          <div className="profile-item">
            <label className="profile-label" htmlFor="bio">
              Bio
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={userData?.bio}
              onChange={onChangeValue}
              readOnly={!isEditable}
            />
          </div>
          <div className="profile-item">
            <label className="profile-label" htmlFor="website">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={userData?.website}
              onChange={onChangeValue}
              readOnly={!isEditable}
            />
          </div>
          <div className="profile-item">
            <label className="profile-label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={userData?.email}
              onChange={onChangeValue}
              readOnly={!isEditable}
            />
          </div>
          <div className="profile-item">
            <label className="profile-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={6}
              placeholder="******"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              readOnly={!isEditable}
            />
          </div>
        </div>
      </form>
      <ChangePhotoModal isVisible={showPhotoModal} photo={userData?.photo} onClose={onChangePhoto}/>
    </div>
  );
}

export default Profile;
