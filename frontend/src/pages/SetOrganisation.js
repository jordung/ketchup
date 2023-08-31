import create from "../assets/setorganisation/tomato.png";
import join from "../assets/setorganisation/ketchup.png";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { LoadingContext, UserContext } from "../App";
import Spinner from "../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";

function SetOrganisation() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(null);

  console.log(user);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <AnimatePresence>
      {loading && <Spinner />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen flex flex-col justify-center items-center"
      >
        <motion.div
          transition={{ duration: 0.2 }}
          layout="position"
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl font-semibold">Welcome, {user.firstName}</h2>
          <p className="text-sm text-center w-full">
            Please select one of the following options:
          </p>
        </motion.div>
        <div className="flex flex-col items-center justify-center mt-4 gap-10 xl:flex-row xl:w-1/2 xl:justify-start">
          {/* Create Organisation Div */}
          <motion.div
            transition={{ layout: { duration: 0.5, type: "spring" } }}
            layout
            className="card p-10 w-full bg-base-100 cursor-pointer h-auto flex flex-col items-center shadow-lg"
            onClick={() => setIsOpen(1)}
          >
            <motion.img
              layout="position"
              src={create}
              alt="create"
              className="h-40 w-auto object-contain"
            />
            <motion.h2
              layout="position"
              className="card-title mt-2 text-center"
            >
              Create a New Organisation
            </motion.h2>
            {isOpen === 1 && (
              <Formik
                key="create"
                initialValues={{ organisationname: "" }}
                validate={(values) => {
                  const errors = {};
                  if (isOpen === 1 && !values.organisationname) {
                    errors.organisationname = "Required";
                  }

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  const setOrganisation = async () => {
                    try {
                      const response = await axios.post(
                        `${process.env.REACT_APP_DB_API}/auth/organisation`,
                        {
                          organisationName: values.organisationname,
                          inviteCode: null,
                          userId: user.id,
                          control: isOpen,
                        }
                      );
                      setUser(response.data.data);
                      toast.success(response.data.msg);
                      navigate("/home");
                    } catch (error) {
                      toast.error(error.response.data.msg);
                      setSubmitting(false);
                    }
                  };

                  setOrganisation();
                }}
              >
                {({ isSubmitting }) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <Form>
                      <label className="label">
                        <span className="label-text font-semibold">
                          What's your organisation's name?
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="organisationname"
                        className="input w-full bg-white max-w-sm md:max-w-lg text-sm"
                      />
                      <label className="label">
                        <ErrorMessage
                          className="label-text-alt text-xs text-primary"
                          name="organisationname"
                          component="div"
                        />
                      </label>
                      <button
                        className="btn btn-primary normal-case w-full rounded-xl"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Create
                      </button>
                    </Form>
                  </motion.div>
                )}
              </Formik>
            )}
          </motion.div>

          {/* Join Organisation Div */}
          <motion.div
            transition={{ layout: { duration: 0.5, type: "spring" } }}
            layout
            className="card p-10 w-full bg-base-100 cursor-pointer h-auto flex flex-col items-center shadow-lg"
            onClick={() => setIsOpen(2)}
          >
            <motion.img
              layout="position"
              src={join}
              alt="join"
              className="h-40 w-auto object-contain"
            />
            <motion.h2
              layout="position"
              className="card-title mt-2 text-center"
            >
              Join an Existing Organisation
            </motion.h2>
            {isOpen === 2 && (
              <Formik
                key="join"
                initialValues={{ invitecode: "" }}
                validate={(values) => {
                  const errors = {};
                  if (isOpen === 2 && !values.invitecode) {
                    errors.invitecode = "Required";
                  }

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  const setOrganisation = async () => {
                    try {
                      console.log(values);
                      const response = await axios.post(
                        `${process.env.REACT_APP_DB_API}/auth/organisation`,
                        {
                          organisationName: null,
                          inviteCode: values.invitecode,
                          userId: user.id,
                          control: isOpen,
                          email: user.email,
                        }
                      );
                      setUser(response.data.data);
                      toast.success(response.data.msg);
                      navigate("/home");
                    } catch (error) {
                      toast.error(error.response.data.msg);
                      setSubmitting(false);
                    }
                  };

                  setOrganisation();
                }}
              >
                {({ isSubmitting }) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <Form>
                      <label className="label">
                        <span className="label-text font-semibold">
                          Please enter your invitation code
                        </span>
                      </label>
                      <Field
                        type="text"
                        name="invitecode"
                        className="input w-full bg-white max-w-sm md:max-w-lg text-sm"
                      />
                      <label className="label">
                        <ErrorMessage
                          className="label-text-alt text-xs text-primary"
                          name="invitecode"
                          component="div"
                        />
                      </label>
                      <button
                        className="btn btn-primary normal-case w-full rounded-xl"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Join
                      </button>
                    </Form>
                  </motion.div>
                )}
              </Formik>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SetOrganisation;
