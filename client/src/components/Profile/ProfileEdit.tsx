import React, { useState } from "react";
import { updateProfile } from "../../api";
import { CameraIcon } from "../../icons";
import UserData from "../../UserData";
import Footer from "../Footer";
import ChangePhotoModal from "./ChangePhotoModal";
import "./ProfileEdit.css";

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
          className="profile-value"
          id={name}
          name={name}
          placeholder={`Enter your ${name}...`}
          value={value || ""}
          onChange={onChangeValue}
        />
      </div>
    );
  }

  return (
    <div className="profile-edit">
      <button className="back" onClick={()=>{props.onSave(props.user)}}>{"<  Back"}</button>
    <div className="profile">
      <div className="profile-header">
          <div className="profile-info">
            <h2>Change Info</h2>
            <p>Changes will be reflected to every services</p>
          </div>
        </div>
      <form className="profile-fields" onSubmit={onClickSubmit}>
      <div className="profile-item">
            <div className="photo-container">
              <img id="photo" className="photo" src={userData!.photo} alt="User" />
              <CameraIcon
                  className="photo-edit"
                  aria-label="Change photo"
                  onClick={openPhotoModal}
                />
                <p>Change Photo</p>
            </div>
          </div>
          {textInput("name", userData?.name)}
          <div className="profile-item">
            <label className="profile-label" htmlFor="bio">
              Bio
            </label>
            <textarea
                className="profile-value"
                id="bio"
                name="bio"
                rows={4}
                value={userData?.bio}
                placeholder="Enter your bio..."
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
              className="profile-value"
              id="password"
              name="password"
              minLength={6}
              placeholder="Enter your new password..."
              value={userData?.password}
              onChange={onChangeValue}
            />
          </div>
        <p className="error">{errorMessage}</p>
        <input
            className="profile-button"
            type="submit"
            name="save"
            value="Save"
            onClick={onClickSubmit}
          />
        <Footer />
      </form>
    </div>
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
