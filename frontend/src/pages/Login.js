import { Formik, Form, Field, ErrorMessage } from "formik";
import logo from "../assets/ketchup-logo.png";
import { useContext, useEffect } from "react";
import { LoadingContext, LoggedInContext, UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { setLoading } = useContext(LoadingContext);
  const { setUser } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-full xl:w-1/2">
        <h2 className="text-2xl font-semibold">Login</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
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
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              // alert(JSON.stringify(values, null, 2));
              setLoading(true);
              const LoginUser = async () => {
                try {
                  const response = await axios.post(
                    `${process.env.REACT_APP_DB_API}/login`,
                    {
                      email: values.email,
                      password: values.password,
                    }
                  );
                  localStorage.setItem(
                    "accessToken",
                    response.data.data.accessToken
                  );
                  localStorage.setItem(
                    "refreshToken",
                    response.data.data.currentUser.refreshToken
                  );
                  setUser(response.data.data.currentUser);
                  setIsLoggedIn(true);
                  navigate("/home");
                } catch (error) {
                  toast.error(`${error.response.data.msg}`, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                } finally {
                  setSubmitting(false);
                  setLoading(false);
                }
              };
              LoginUser();
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-full items-center mt-8" noValidate>
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
              <button
                className="btn btn-primary w-full max-w-xs md:max-w-lg mt-4 normal-case"
                type="submit"
                disabled={isSubmitting}
              >
                Let's Ketchup!
              </button>
              <p className="text-sm font-semibold mt-4 max-w-xs md:max-w-lg text-center">
                Hey there! If you’re new, head on to our{" "}
                <span
                  className="underline text-secondary btn btn-link btn-sm p-0 normal-case"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>{" "}
                page!
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

export default Login;
