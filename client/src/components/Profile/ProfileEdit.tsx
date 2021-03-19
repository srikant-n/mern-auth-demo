import React, { useState } from "react";
import { updateProfile } from "../../api";
import { CameraIcon } from "../../icons";
import UserData from "../../UserData";
import Footer from "../Footer";
import ChangePhotoModal from "./ChangePhotoModal";
import "./Profile.css";

function ProfileEdit(props: { user: UserData; onSave: (user: UserData) => void }) {
  const [userData, setUserData] = useState<UserData | undefined>(props.user);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

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
        props.onSave(user!);
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
        />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <form className="profile-edit" onSubmit={onClickSubmit}>
        <div className="profile-header">
          <div className="profile-info">
            <h2>Profile</h2>
            <p>Some info may be visible to other people</p>
          </div>
          <input
            className="profile-button"
            type="submit"
            name="save"
            value="Save"
            onClick={onClickSubmit}
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
              <CameraIcon
                  className="photo-edit"
                  aria-label="Change photo"
                  onClick={openPhotoModal}
                />
            </div>
          </div>
          {textInput("name", userData?.name)}
          <div className="profile-item">
            <label className="profile-label" htmlFor="bio">
              Bio
            </label>
            <textarea
                className="input"
                id="bio"
                name="bio"
                rows={4}
                value={userData?.bio}
                onChange={onChangeValue}
              />
          </div>
          {textInput("phone", userData?.phone)}
          {textInput("email", userData?.email)}
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
            />
          </div>
        </div>
        <Footer />
      </form>
      <ChangePhotoModal
        isVisible={showPhotoModal}
        id={userData!.id}
        photo={userData?.photo}
        onClose={onChangePhoto}
      />
    </div>
  );
}

export default ProfileEdit;
