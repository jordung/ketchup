import { Formik, Form, Field, ErrorMessage } from "formik";
import logo from "../assets/ketchup-logo.png";
import { useContext, useEffect, useState } from "react";
import { LoadingContext, LoggedInContext, UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Avatar, { genConfig } from "react-nice-avatar";
import domtoimage from "dom-to-image";
import {
  PiArrowsCounterClockwiseBold,
  PiTrashBold,
  PiArrowLeftBold,
} from "react-icons/pi";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { socket } from "../utils/socket-client";

function SignupThroughInvite() {
  const { setLoading } = useContext(LoadingContext);
  const { setUser } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(LoggedInContext);

  const urlParams = new URLSearchParams(window.location.search);
  const inviteCode = urlParams.get("inviteCode");

  const [organisationName, setOrganisationName] = useState("");
  const [organisationId, setOrganisationId] = useState();

  const [isCreating, setIsCreating] = useState(false);
  const [blobConfig, setBlobConfig] = useState(true);
  const [showFirstStep, setShowFirstStep] = useState(true);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getOrganisationInformation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/invite`,
          {
            params: {
              inviteCode: inviteCode,
            },
          }
        );
        toast.success(`${response.data.msg}`);
        setOrganisationName(response.data.data.organisation.name);
        setOrganisationId(response.data.data.organisation.id);
        setEmail(response.data.data.inviteeEmail);
      } catch (error) {
        navigate("/");
        toast.error(`${error.response.data.msg}`);
      } finally {
        setBlobConfig(genConfig());
        setLoading(false);
      }
    };

    getOrganisationInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const STORAGE_KEY = "profile/";

  // to refresh random avatar
  const handleRefreshAvatar = () => {
    setBlobConfig(genConfig());
  };

  // submit user display picture
  const handleCreateAccount = async () => {
    setIsCreating(true);
    // check if user has uploaded own profile picture
    if (profilePictureFile) {
      // user uploads own profile picture
      const storageRefInstance = ref(
        storage,
        STORAGE_KEY + profilePictureFile.name
      );
      uploadBytes(storageRefInstance, profilePictureFile).then((snapshot) => {
        getDownloadURL(storageRefInstance, profilePictureFile.name).then(
          (url) => {
            const sendSignupThroughInviteInformation = async () => {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_DB_API}/auth/signupthroughinvite`,
                  {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    profilePicture: url,
                    organisationId: organisationId,
                    inviteCode: inviteCode,
                  }
                );

                setUser(response.data.data.user);

                localStorage.setItem(
                  "accessToken",
                  response.data.data.accessToken
                );
                localStorage.setItem(
                  "refreshToken",
                  response.data.data.user.refreshToken
                );

                socket.emit("new_joiner", {
                  target: organisationId,
                  title: `${firstName} ${lastName} has joined ${organisationName}`,
                });

                setIsLoggedIn(true);
                toast.success(`${response.data.msg}`);
                navigate("/home");
              } catch (error) {
                toast.error(`${error.response.data.msg}`);
                const profilePictureRef = ref(storage, url);
                deleteObject(profilePictureRef);
              } finally {
                setIsCreating(false);
              }
            };
            sendSignupThroughInviteInformation();
          }
        );
      });
    } else {
      // user uses default avatar
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
            const sendSignupThroughInviteInformation = async () => {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_DB_API}/auth/signupthroughinvite`,
                  {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    profilePicture: url,
                    organisationId: organisationId,
                    inviteCode: inviteCode,
                  }
                );
                setUser(response.data.data.user);

                localStorage.setItem(
                  "accessToken",
                  response.data.data.accessToken
                );
                localStorage.setItem(
                  "refreshToken",
                  response.data.data.user.refreshToken
                );

                socket.emit("new_joiner", {
                  target: organisationId,
                  title: `${firstName} ${lastName} has joined ${organisationName}`,
                });

                setIsLoggedIn(true);
                toast.success(`${response.data.msg}`);
                navigate("/home");
              } catch (error) {
                console.log(error);
                const profilePictureRef = ref(storage, url);
                deleteObject(profilePictureRef);
                toast.error(`${error.response.data.msg}`);
              } finally {
                setIsCreating(false);
              }
            };
            sendSignupThroughInviteInformation();
          });
        });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <AnimatePresence mode="wait">
        {showFirstStep ? (
          // * Step 1: Render out form to collect user information

          <motion.div
            key="0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full xl:w-1/2"
          >
            <h2 className="text-2xl font-semibold w-5/6 text-center">
              You're on your way to{" "}
              <span className="italic text-primary">{organisationName}</span>
            </h2>
            <Formik
              initialValues={{
                firstname: "",
                lastname: "",
                email: email,
                password: "",
                confirmpassword: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.firstname) {
                  errors.firstname = "Required";
                }
                if (!values.lastname) {
                  errors.lastname = "Required";
                }
                if (!values.password) {
                  errors.password = "Required";
                }
                if (!values.confirmpassword) {
                  errors.confirmpassword = "Required";
                }
                if (values.confirmpassword !== values.password) {
                  errors.confirmpassword = "Passwords mismatch";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setFirstName(values.firstname);
                setLastName(values.lastname);
                // setEmail(values.email);
                setPassword(values.password);
                setSubmitting(false);
                setShowFirstStep(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form
                  className="flex flex-col w-full items-center mt-8"
                  noValidate
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="form-control w-full max-w-xs md:max-w-lg">
                      <label className="label">
                        <span className="label-text font-semibold">
                          First Name
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="firstname"
                        placeholder="Steve"
                        className="input w-full max-w-sm text-sm md:max-w-lg"
                      />
                      <label className="label">
                        <ErrorMessage
                          className="label-text-alt text-xs text-primary"
                          name="firstname"
                          component="div"
                        />
                      </label>
                    </div>
                    <div className="form-control w-full max-w-xs md:max-w-lg">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Last Name
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="lastname"
                        placeholder="Jobs"
                        className="input w-full max-w-sm md:max-w-lg text-sm"
                      />
                      <label className="label">
                        <ErrorMessage
                          className="label-text-alt text-xs text-primary"
                          name="lastname"
                          component="div"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="form-control w-full max-w-xs md:max-w-lg">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled
                      defaultValue={email}
                      className="input w-full max-w-sm md:max-w-lg text-sm"
                    />
                    <label className="label">
                      <ErrorMessage
                        className="label-text-alt text-xs text-primary"
                        name="email"
                        component="div"
                      />
                    </label>
                  </div>
                  <div className="form-control w-full max-w-xs md:max-w-lg">
                    <label className="label">
                      <span className="label-text font-semibold">Password</span>
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="input w-full max-w-sm md:max-w-lg text-sm"
                    />
                    <label className="label">
                      <ErrorMessage
                        className="label-text-alt text-xs text-primary"
                        name="password"
                        component="div"
                      />
                    </label>
                  </div>
                  <div className="form-control w-full max-w-xs md:max-w-lg">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Confirm Password
                      </span>
                    </label>
                    <Field
                      type="password"
                      name="confirmpassword"
                      className="input w-full max-w-sm md:max-w-lg text-sm"
                    />
                    <label className="label">
                      <ErrorMessage
                        className="label-text-alt text-xs text-primary"
                        name="confirmpassword"
                        component="div"
                      />
                    </label>
                  </div>
                  <button
                    className="btn btn-primary w-full rounded-xl max-w-xs md:max-w-lg mt-4 normal-case"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Continue
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        ) : (
          // * Step 2: Rendering out setting profile picture UI
          <motion.div
            key="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full xl:w-1/2"
          >
            <h2 className="text-2xl font-semibold">Set Your Avatar</h2>
            <p className="text-sm text-center w-3/4">
              You can choose from any of our existing avatars, or feel free to
              upload your own picture!
            </p>
            <div className="relative h-auto w-auto">
              {!profilePictureFile ? (
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
                    src={URL.createObjectURL(profilePictureFile)}
                    alt="profile"
                    className="w-56 h-56 mt-4 object-cover rounded-full"
                  />
                  <button
                    className="btn btn-link absolute bottom-0 right-0"
                    onClick={() => setProfilePictureFile(null)}
                  >
                    <PiTrashBold className="h-10 w-10 bg-base-100 p-2 rounded-xl text-neutral" />
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
                onChange={(e) => setProfilePictureFile(e.target.files[0])}
              />
              <button
                className="btn btn-primary w-1/2 rounded-xl max-w-xs md:max-w-lg mt-4 normal-case"
                onClick={handleCreateAccount}
                disabled={isCreating}
              >
                Create Account
              </button>
              <button
                className="btn btn-base-100 btn-sm w-1/2 rounded-xl max-w-xs md:max-w-lg normal-case"
                onClick={() => setShowFirstStep(true)}
              >
                <PiArrowLeftBold /> Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden xl:flex bg-base-100 h-screen w-1/2 items-center justify-center ">
        <img src={logo} alt="logo" className="max-w-md" />
      </div>
    </div>
  );
}

export default SignupThroughInvite;
