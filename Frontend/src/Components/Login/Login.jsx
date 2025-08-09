import { useState, useContext } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StateContext from "../../Context/StateContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setrefetchUser } = useContext(StateContext);

  const LoginUser = async () => {
    const BaseUrl = "https://youtube-clone-6wbs.onrender.com/api";

    const LoginInfo = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${BaseUrl}/v1/auth/login`, LoginInfo, {
        withCredentials: true,
      });
      console.log(response);
      navigate("/");
      setrefetchUser((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div id="container_login">
        <div id="form_container">
          <div id="sign_in_form">
            <div id="sign_in_heading">Sign In</div>
            <form>
              <input
                type="text"
                placeholder={"Username"}
                required
                minLength={6}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder={"Password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div id="reset_pass">Forgot Password</div>
              <div
                id="sign_in_btn"
                onClick={(e) => {
                  e.preventDefault();
                  LoginUser();
                }}
              >
                Sign In
              </div>
            </form>
            <div id="or">Other Ways</div>
          </div>
        </div>
        <div id="side_container">
          <div id="side_sign_up">
            <div id="side_sign_up_heading">Its your first Time</div>
            <div id="side_sign_up_text">
              Sign up and get ready for a hot experience you won’t forget.
            </div>
            <button
              id="side_sign_up_btn"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
