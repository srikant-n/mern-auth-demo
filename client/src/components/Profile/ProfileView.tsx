import React from "react";
import UserData from "../../UserData";
import Footer from "../Footer";
import "./Profile.css";

function ProfileView(props: { user: UserData; onClickEdit: () => void }) {
  /**
   * Get Text input for form
   * @param name Input name and label
   * @param value Input field value
   * @returns Form item component
   */
  function profileField(name: string, value?: string) {
    return (
      <div className="profile-item">
        <p className="profile-label">{name}</p>
        <p className="profile-value">{value || ""}</p>
      </div>
    );
  }

  return (
    <div  className="profile-container">
      <div className="page-info">
        <h2>Personal info</h2>
        <p>Basic info, like your name and photo</p>
      </div>
      <div className="profile-view">
        <div className="profile-header">
          <div className="profile-info">
            <h2>Profile</h2>
            <p>Some info may be visible to other people</p>
          </div>
          <button className="edit" onClick={props.onClickEdit}>
            Edit
          </button>
        </div>
        <div className="profile">
          <hr />
          <div className="profile-item">
            <p className="profile-label">Photo</p>
            <div className="photo-container">
              <img
                id="photo"
                className="photo"
                src={props.user.photo}
                alt="User"
              />
            </div>
          </div>
          <hr />
          {profileField("name", props.user.name)}
          <hr />
          {profileField("bio", props.user.bio)}
          <hr />
          {profileField("phone", props.user.phone)}
          <hr />
          {profileField("email", props.user.email)}
          <hr />
          {profileField("password", "******")}
          <hr />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ProfileView;
