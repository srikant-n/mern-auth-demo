import React, { useRef, useState } from "react";
import { uploadImage } from "../../api";
import "./ChangePhotoModal.css";

function ChangePhotoModal(props: {
  isVisible: boolean;
  id:string;
  photo?: string;
  onClose: (photo?: string) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(props.photo);
  const [newUrl, setNewUrl] = useState<string>("");
  const fileInput = useRef() as React.MutableRefObject<HTMLInputElement>;

  /**
   * Clear form values
   */
  function clearFields() {
    if(fileInput) fileInput.current.value = "";
    setNewUrl("");
  }

  /**
   * URL entered by user
   * @param event Input event
   */
  function onEnterUrl(event:any):void {
    setNewUrl(event.target.value);
    setPhotoUrl(event.target.value);
  }

  /**
   * Photo submitted by user
   * @param event Form submit event
   */
  function onSubmitPhoto(event: any): void {
    event.preventDefault();
    props.onClose(photoUrl ? photoUrl : "");
    clearFields();
  }

  /**
   * File selected by user
   * @param files Selected files
   */
  function onFileSelected(files: any): void {
    // Check if file is an image
    if (files[0] && files[0].type.match(/image.*/)) {
      uploadImage(props.id, files[0], (error, url) => {
        if (error) {
          // show error
        } else {
          setPhotoUrl(url);
        }
      });
    }
  }

  /**
   * Canceled photo changing
   */
  function onCancel() {
    setPhotoUrl(props.photo);
    props.onClose(props.photo);
    clearFields();
  }

  return !props.isVisible ? (
    <div />
  ) : (
    <div className="modal">
      <div className="modal-card">
        <h2>Change Photo</h2>
        <img src={photoUrl} alt="User" />
        <form onSubmit={onSubmitPhoto}>
          <label className="profile-label" htmlFor="newPhotoUrl">
            Photo Link
          </label>
          <input
            type="text"
            id="newPhotoUrl"
            name="newPhotoUrl"
            value={newUrl}
            onChange={onEnterUrl}
          />
          <p>or</p>
          <input
          ref={fileInput}
            type="file"
            name="file"
            accept="image/*"
            onChange={(event) => onFileSelected(event.target.files)}
            aria-label="Choose a file"
          />
          <div className="buttons">
            <input type="submit" value="Submit" />
            <input className="cancel" type="button" value="Cancel" onClick={onCancel} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePhotoModal;
