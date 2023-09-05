import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { PiTrashBold, PiArrowsCounterClockwiseBold } from "react-icons/pi";
import Avatar, { genConfig } from "react-nice-avatar";
import domtoimage from "dom-to-image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../App";

function EditUserModal(props) {
  const { user, setUserProfile } = props;
  const { setUser } = useContext(UserContext);

  const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);
  const [blobConfig, setBlobConfig] = useState();

  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [updatedProfilePictureFile, setUpdatedProfilePictureFile] = useState();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const clearUploadedProfilePicture = (e) => {
    setUpdatedProfilePictureFile(null);
    e.preventDefault();
  };

  const handleIsUpdateAvatar = (e) => {
    e.preventDefault();
    setIsUpdateAvatar(true);
  };

  // to refresh random avatar
  const handleRefreshAvatar = (e) => {
    e.preventDefault();
    setBlobConfig(genConfig());
  };

  const resetValues = (e) => {
    if (e) e.preventDefault();
    setProfilePicture(user.profilePicture);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsUpdateAvatar(false);
    setUpdatedProfilePictureFile(null);
  };

  const handleUpdateUser = async () => {
    const STORAGE_KEY = "profile/";
    const accessToken = localStorage.getItem("accessToken");

    if (updatedProfilePictureFile) {
      // if user has uploaded their own picture

      // upload new profile picture
      const storageRefInstance = ref(
        storage,
        STORAGE_KEY + updatedProfilePictureFile.name
      );
      uploadBytes(storageRefInstance, updatedProfilePictureFile).then(
        (snapshot) => {
          getDownloadURL(
            storageRefInstance,
            updatedProfilePictureFile.name
          ).then((url) => {
            // once profile picture is uploaded to firebase, send information to backend
            const updateProfileWithNewPicture = async () => {
              try {
                // delete old picture first
                const oldProfilePictureRef = ref(storage, profilePicture);
                try {
                  deleteObject(oldProfilePictureRef);
                } catch (error) {
                  console.log(error);
                }
                const response = await axios.post(
                  `${process.env.REACT_APP_DB_API}/users/${user.id}`,
                  {
                    profilePicture: url,
                    firstName: firstName,
                    lastName: lastName,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
                setUser(response.data.data.updatedUser);
                setUserProfile(response.data.data.updatedUser);
                setProfilePicture(
                  response.data.data.updatedUser.profilePicture
                );
                setFirstName(response.data.data.updatedUser.firstName);
                setLastName(response.data.data.updatedUser.lastName);
                setIsUpdateAvatar(false);
                setUpdatedProfilePictureFile(null);
                toast.success(`${response.data.msg}`);
              } catch (error) {
                // if there was an error in sending information to firebase, delete the uploaded image
                const profilePictureRef = ref(storage, url);
                deleteObject(profilePictureRef);
                toast.error(`${error.response.data.msg}`);
              }
            };
            updateProfileWithNewPicture();
          });
        }
      );
    } else if (isUpdateAvatar) {
      // else if user has updated their blob avatar
      const filename = uuidv4();
      const scale = 2;
      const node = document.getElementById("avatar");
      if (node) {
        const blob = await domtoimage.toBlob(node, {
          height: node.offsetHeight * scale,
          style: {
            transform: `scale(${scale}) translate(${
              node.offsetWidth / 2 / scale
            }px, ${node.offsetHeight / 2.5 / scale}px)`,
            "border-radius": 0,
          },
          width: node.offsetWidth * scale,
        });

        const storageRefInstance = ref(storage, STORAGE_KEY + filename);
        uploadBytes(storageRefInstance, blob).then((snapshot) => {
          getDownloadURL(storageRefInstance, filename).then((url) => {
            const updateProfileWithNewAvatarBlob = async () => {
              try {
                // delete old profile picture
                const oldProfilePictureRef = ref(storage, profilePicture);
                try {
                  deleteObject(oldProfilePictureRef);
                } catch (error) {
                  console.log(error);
                }
                const response = await axios.post(
                  `${process.env.REACT_APP_DB_API}/users/${user.id}`,
                  {
                    profilePicture: url,
                    firstName: firstName,
                    lastName: lastName,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
                setUser(response.data.data.updatedUser);
                setUserProfile(response.data.data.updatedUser);
                setProfilePicture(
                  response.data.data.updatedUser.profilePicture
                );
                setFirstName(response.data.data.updatedUser.firstName);
                setLastName(response.data.data.updatedUser.lastName);
                setIsUpdateAvatar(false);
                setUpdatedProfilePictureFile(null);
                toast.success(`${response.data.msg}`);
              } catch (error) {
                const profilePictureRef = ref(storage, url);
                deleteObject(profilePictureRef);
                toast.error(`${error.response.data.msg}`);
              }
            };
            updateProfileWithNewAvatarBlob();
          });
        });
      }
    } else {
      // else if user did not touch their profile picture, only name fields
      const updateProfileWithoutChangingPicture = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_DB_API}/users/${user.id}`,
            {
              profilePicture: profilePicture,
              firstName: firstName,
              lastName: lastName,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUser(response.data.data.updatedUser);
          setUserProfile(response.data.data.updatedUser);
          setProfilePicture(response.data.data.updatedUser.profilePicture);
          setFirstName(response.data.data.updatedUser.firstName);
          setLastName(response.data.data.updatedUser.lastName);
          setIsUpdateAvatar(false);
          setUpdatedProfilePictureFile(null);
          toast.success(`${response.data.msg}`);
        } catch (error) {
          toast.error(`${error.response.data.msg}`);
        }
      };
      updateProfileWithoutChangingPicture();
    }
  };

  return (
    <dialog id="editUserModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Edit Profile</h3>
        <div className="flex flex-col items-center">
          <div className="relative h-auto w-auto">
            {/*   1. check if user has uploaded new profile picture -> if yes, show new profile picture
                2. check if user has clicked on refresh avatar button -> if yes, show new refreshed avatar
                3. else, show user's existing profile picture */}
            {updatedProfilePictureFile ? (
              <>
                <img
                  src={URL.createObjectURL(updatedProfilePictureFile)}
                  alt="profile"
                  className="w-56 h-56 mt-4 object-cover rounded-full"
                />
                <button
                  className="btn btn-link absolute bottom-0 right-0"
                  onClick={clearUploadedProfilePicture}
                >
                  <PiTrashBold className="h-10 w-10 bg-base-100 p-2 rounded-xl text-neutral" />
                </button>
              </>
            ) : isUpdateAvatar ? (
              <>
                <Avatar
                  className="w-56 h-56 mt-4"
                  {...blobConfig}
                  id="avatar"
                />
                <button
                  className="btn btn-link absolute bottom-0 right-0"
                  onClick={handleRefreshAvatar}
                >
                  <PiArrowsCounterClockwiseBold className="h-10 w-10 bg-base-100 p-2 rounded-xl text-neutral" />
                </button>
              </>
            ) : (
              <>
                <img
                  className="w-56 h-56 mt-4 rounded-full object-cover"
                  src={profilePicture}
                  alt="existing profile"
                />
                <button
                  className="btn btn-link absolute bottom-0 right-0"
                  onClick={handleIsUpdateAvatar}
                >
                  <PiArrowsCounterClockwiseBold className="h-10 w-10 bg-base-100 p-2 rounded-xl text-neutral" />
                </button>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 w-full justify-center items-center">
            <label
              className="btn btn-base-100 rounded-xl btn-sm normal-case"
              htmlFor="image-input"
            >
              Upload
            </label>
            <input
              id="image-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setUpdatedProfilePictureFile(e.target.files[0])}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="pt-4 text-sm font-semibold">First Name</p>
          <input
            type="text"
            className="input input-sm w-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="pt-4 text-sm font-semibold">Last Name</p>
          <input
            type="text"
            className="input input-sm w-full"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button
          className="btn btn-neutral btn-sm font-semibold text-sm normal-case w-full mt-4"
          onClick={handleUpdateUser}
        >
          Confirm changes
        </button>
        <button
          className="btn btn-sm font-semibold text-sm normal-case w-full mt-2"
          onClick={resetValues}
        >
          Reset
        </button>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default EditUserModal;
