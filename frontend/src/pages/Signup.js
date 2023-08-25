import { Formik, Form, Field, ErrorMessage } from "formik";
import logo from "../assets/ketchup-logo.png";
import { useContext, useEffect } from "react";
import { LoadingContext } from "../App";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      {loading && <Spinner />}
      <div className="flex flex-col items-center justify-center w-full xl:w-1/2">
        <h2 className="text-2xl font-semibold">Sign Up</h2>
        <Formik
          initialValues={{
            firstname: "",
            lastname: "",
            email: "",
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
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
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
            setTimeout(() => {
              // alert(JSON.stringify(values, null, 2));
              setLoading(true);
              console.log(values);
              // TODO: send this value to backend
              // TODO: navigate to "/home" after
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-full items-center mt-8" noValidate>
              <div className="flex flex-col items-center w-full">
                <div className="form-control w-full max-w-xs md:max-w-lg">
                  <label className="label">
                    <span className="label-text font-semibold">First Name</span>
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
                    <span className="label-text font-semibold">Last Name</span>
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
                <Field
                  type="email"
                  name="email"
                  placeholder="stevejobs@apple.com"
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
                className="btn btn-primary w-full max-w-xs md:max-w-lg mt-4 normal-case"
                type="submit"
                disabled={isSubmitting}
              >
                Create Account
              </button>
              <p className="text-sm font-semibold mt-4">
                Already have an account with us?{" "}
                <span
                  className="underline text-secondary btn btn-link p-0 normal-case btn-sm"
                  onClick={() => navigate("/login")}
                >
                  Login now!
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
      <div className="hidden xl:flex bg-base-100 h-screen w-1/2 items-center justify-center ">
        <img src={logo} alt="logo" className="max-w-md" />
      </div>
    </div>
  );
}

export default Signup;
