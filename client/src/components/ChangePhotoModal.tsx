import React, { useEffect, useState } from "react";
import { uploadImage } from "../api";

function ChangePhotoModal(props: {
  isVisible: boolean;
  photo?: string;
  onClose: (photo: string) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [newUrl, setNewUrl] = useState<string>("");

  useEffect(() => {
    setPhotoUrl(props.photo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmitPhoto(event:any): void {
      event.preventDefault();
      props.onClose(photoUrl ? photoUrl : "");
  }

  function onFileSelected(files: any): void {
    // Check if file is an image
    if (files[0] && files[0].type.match(/image.*/)) {
      uploadImage(files[0], (error, url) => {
          if(error) {
              // show error
          } else {
              setPhotoUrl(url);
          }
      });
    }
  }
  return !props.isVisible ? (
    <div />
  ) : (
    <div className="modal-background">
      <div className="modal-container">
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
            onChange={(event) => setNewUrl(event.target.value)}
          />
          <label htmlFor="file">Choose a file</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={(event) => onFileSelected(event.target.files)}
          />
          <input type="submit" value="Submit" />
          <input type="button" value="Cancel" onClick={onSubmitPhoto} />
        </form>
      </div>
    </div>
  );
}

export default ChangePhotoModal;