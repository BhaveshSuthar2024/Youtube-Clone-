import { useState, useContext } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StateContext from "../../Context/StateContext";
import API_BASE_URL from "../../Utils/api.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const { setrefetchUser } = useContext(StateContext);

  const LoginUser = async () => {
    setIsSubmitting(true);
    setLoginError("");

    const LoginInfo = {
      email,
      password,
    };

    try {
      await axios.post(`${API_BASE_URL}/v1/auth/login`, LoginInfo, {
        withCredentials: true,
      });

      navigate("/");
      setrefetchUser((prev) => !prev);
    } catch (error) {
      setLoginError(
        error.response?.data?.message ||
          "We couldn’t sign you in. Check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="container_login">
      <section id="side_container">
        <div id="side_sign_up">
          <span className="login_brand_mark" aria-hidden="true">
            Y
          </span>
          <p className="login_eyebrow">WELCOME TO YOUTUBE</p>
          <h2 id="side_sign_up_heading">Your next favorite video is waiting.</h2>
          <p id="side_sign_up_text">
            Join the community to save videos, build playlists, and make your
            own channel.
          </p>
          <button
            id="side_sign_up_btn"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Create an account
          </button>
        </div>
      </section>

      <section id="form_container" aria-labelledby="sign_in_heading">
        <div id="sign_in_form">
          <p className="login_eyebrow login_eyebrow_form">YOUR ACCOUNT</p>
          <h1 id="sign_in_heading">Welcome back</h1>
          <p className="login_form_intro">Sign in to continue watching.</p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              LoginUser();
            }}
          >
            <label htmlFor="login_email">Email address</label>
            <input
              id="login_email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div className="login_password_label">
              <label htmlFor="login_password">Password</label>
              <button id="reset_pass" type="button" disabled>
                Forgot password?
              </button>
            </div>
            <input
              id="login_password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {loginError && (
              <p className="login_error" role="alert">
                {loginError}
              </p>
            )}

            <button
              id="sign_in_btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="login_signup_mobile">
            New here?{" "}
            <button type="button" onClick={() => navigate("/signup")}>
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
