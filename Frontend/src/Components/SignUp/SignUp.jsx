import React, { useState, useContext } from "react";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { countryList, languageList, tags, privacy } from "../../Utils/data.js";
import Select from "react-select";
import StateContext from "../../Context/StateContext";
import Lottie from "lottie-react";
import AnimationData from "../../../public/Animation.json";
import API_BASE_URL from "../../Utils/api.js";

function SignUp() {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [dob, setdob] = useState("");
  const [permission, setpermission] = useState(false);
  const [isBasicInfoCompleted, setisBasicInfoCompleted] = useState(false);
  const [createChannelVisible, setcreateChannelVisible] = useState(false);
  const [profileImgLoacalPath, setprofileImgLoacalPath] = useState("");
  const [profileImagePreview, setprofileImagePreview] = useState("");
  const [loading, setloading] = useState(false);

  const [channelName, setchannelName] = useState("");
  const [channelDisc, setchannelDisc] = useState("");
  const [country, setcountry] = useState("India");
  const [language, setlanguage] = useState("Hindi");
  const [selectedTags, setselectedTags] = useState([]);
  const [coverImage, setcoverImage] = useState("");
  const [channelPrivacy, setchannelPrivacy] = useState("public");
  const [colorTheme, setcolorTheme] = useState("");
  const [coverImagePreview, setcoverImagePreview] = useState(null);
  const [isEmailVarified, setisEmailVarified] = useState(false);
  const [otp, setotp] = useState("");
  const [isSendingOTP, setisSendingOTP] = useState(false);
  const [isVerifyingOTP, setisVerifyingOTP] = useState(false);
  const [isOTPSent, setisOTPSent] = useState(false);
  const [otpMessage, setotpMessage] = useState("");
  const [otpMessageType, setotpMessageType] = useState("");

  const navigate = useNavigate();
  const { setrefetchUser } = useContext(StateContext);

  const ProfileImgReader = (e) => {
    const file = e.target.files[0];
    setprofileImgLoacalPath(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setprofileImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const RegisterHandler = async () => {
    setloading(true);

    const formdata = new FormData();

    formdata.append("firstname", firstname);
    formdata.append("lastname", lastname);
    formdata.append("username", username);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("confirmPassword", confirmPassword);
    formdata.append("DOB", dob);
    formdata.append("profileImage", profileImgLoacalPath);
    formdata.append("isEmailVarified", isEmailVarified);

    try {
      await axios.post(`${API_BASE_URL}/v1/auth/signup`, formdata, {
        withCredentials: true,
      });
      setcreateChannelVisible(true);
      setrefetchUser((prev) => !prev);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const tagsOptions = tags.map((tag) => ({
    value: tag.value,
    label: tag.label,
  }));

  const CoverFileHandler = (e) => {
    const file = e.target.files[0];
    setcoverImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setcoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const GenerateChannelHandler = async () => {
    

    const formdata = new FormData();

    formdata.append("name", channelName);
    formdata.append("discription", channelDisc);
    formdata.append("coverImage", coverImage);
    formdata.append("country", country);
    formdata.append("language", language);
    formdata.append("themeColor", colorTheme);
    formdata.append("privacy", channelPrivacy);
    

    try {
      await axios.post(
        `${API_BASE_URL}/v1/channel/createChannel`,
        formdata,
        { withCredentials: true },
      );
      
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const generateOTP = async () => {
    if (!email.trim()) {
      setotpMessage("Enter your email address first.");
      setotpMessageType("error");
      return;
    }

    setisSendingOTP(true);
    setotpMessage("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1/auth/generateOTP`,
        { email: email.trim() },
      );
      setisOTPSent(true);
      setotp("");
      setotpMessage(response.data?.message || "A verification code was sent to your email.");
      setotpMessageType("success");
    } catch (error) {
      setotpMessage(
        error.response?.data?.message ||
          "We couldn’t send a code. Check your email and try again.",
      );
      setotpMessageType("error");
    } finally {
      setisSendingOTP(false);
    }
  };

  const validateOTP = async () => {
    if (otp.length !== 6) {
      setotpMessage("Enter the 6-digit code from your email.");
      setotpMessageType("error");
      return;
    }

    setisVerifyingOTP(true);
    setotpMessage("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1/auth/validateOTP`,
        { email: email.trim(), otp },
      );
      setisEmailVarified(response?.data?.isEmailVarified);
      setotpMessage(
        response.data?.message || "Your email has been verified.",
      );
      setotpMessageType("success");
    } catch (error) {
      setotpMessage(
        error.response?.data?.message ||
          "That code could not be verified. Try again or request a new one.",
      );
      setotpMessageType("error");
    } finally {
      setisVerifyingOTP(false);
    }
  };

  return (
    <>
      <div id="signup_screen">
        {!loading ? (
          <>
            {!isBasicInfoCompleted && !createChannelVisible && (
              <div id="signup_container">
                <div
                  id="back_arrow_button_basic"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
                <header className="signup_header">
                  <p className="signup_eyebrow">JOIN THE COMMUNITY</p>
                  <h1 id="signup_heading">Create your account</h1>
                  <p className="signup_intro">
                    Sign up to save videos, build playlists, and create your
                    channel.
                  </p>
                </header>
                <button id="register_with_Google_container" type="button">
                  <div id="register_with_Google_icon_container">
                    <img src="search.png" alt="" />
                  </div>
                  <div id="register_with_Google_text">Register With Google</div>
                </button>
                <div id="partition" aria-hidden="true">
                  <div id="partition_text">or</div>
                </div>
                <form
                  id="signup_form"
                  className="signup_form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!isEmailVarified) {
                      setotpMessage("Verify your email address to continue.");
                      setotpMessageType("error");
                      return;
                    }
                    setisBasicInfoCompleted(true);
                  }}
                >
                  <div className="signup_field_grid signup_name_fields">
                    <div className="signup_field">
                      <label htmlFor="signup_firstname">First name</label>
                      <input
                        id="signup_firstname"
                        type="text"
                        placeholder="First name"
                        autoComplete="given-name"
                        required
                        value={firstname}
                        onChange={(e) => setfirstname(e.target.value)}
                      />
                    </div>
                    <div className="signup_field">
                      <label htmlFor="signup_lastname">Last name</label>
                      <input
                        id="signup_lastname"
                        type="text"
                        placeholder="Last name"
                        autoComplete="family-name"
                        required
                        value={lastname}
                        onChange={(e) => setlastname(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="signup_field">
                    <label htmlFor="signup_username">Username</label>
                    <input
                      id="signup_username"
                      type="text"
                      placeholder="Choose a username"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                    />
                  </div>

                  <section className="signup_verification" aria-labelledby="email_verification_heading">
                    <div className="verification_heading">
                      <div>
                        <h2 id="email_verification_heading">Email address</h2>
                        <p>We’ll send a 6-digit code to confirm it’s yours.</p>
                      </div>
                      <span
                        className={`verification_badge${isEmailVarified ? " is_verified" : ""}`}
                      >
                        <i
                          className={`fa-solid ${isEmailVarified ? "fa-circle-check" : "fa-envelope"}`}
                          aria-hidden="true"
                        />
                        {isEmailVarified ? "Verified" : "Required"}
                      </span>
                    </div>
                    <div className="verification_input_row">
                      <input
                        id="signup_email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-label="Email address"
                        required
                        value={email}
                        onChange={(e) => {
                          setemail(e.target.value);
                          setisEmailVarified(false);
                          setisOTPSent(false);
                          setotp("");
                          setotpMessage("");
                          setotpMessageType("");
                        }}
                      />
                      <button
                        className="verification_action"
                        type="button"
                        onClick={generateOTP}
                        disabled={isSendingOTP || isEmailVarified}
                      >
                        {isEmailVarified
                          ? "Verified"
                          : isSendingOTP
                            ? "Sending..."
                            : isOTPSent
                              ? "Resend code"
                              : "Send code"}
                      </button>
                    </div>
                    {isOTPSent && !isEmailVarified && (
                      <div className="verification_code_row">
                        <input
                          id="signup_otp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="6-digit code"
                          aria-label="6-digit email verification code"
                          maxLength={6}
                          value={otp}
                          onChange={(e) =>
                            setotp(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                        />
                        <button
                          className="verification_action verification_confirm"
                          type="button"
                          onClick={validateOTP}
                          disabled={otp.length !== 6 || isVerifyingOTP}
                        >
                          {isVerifyingOTP ? "Checking..." : "Verify email"}
                        </button>
                      </div>
                    )}
                    {otpMessage && (
                      <p
                        className={`verification_message ${otpMessageType}`}
                        role={otpMessageType === "error" ? "alert" : "status"}
                      >
                        {otpMessage}
                      </p>
                    )}
                  </section>

                  <div className="signup_field_grid signup_name_fields">
                    <div className="signup_field">
                      <label htmlFor="signup_password">Password</label>
                      <input
                        id="signup_password"
                        type="password"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                      />
                    </div>
                    <div className="signup_field">
                      <label htmlFor="signup_confirm_password">
                        Confirm password
                      </label>
                      <input
                        id="signup_confirm_password"
                        type="password"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setconfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="signup_consent">
                    <input
                      type="checkbox"
                      name="permission"
                      checked={permission}
                      onChange={(e) => setpermission(e.target.checked)}
                    />
                    <span>
                      I accept the platform guidelines and agree to follow
                      community regulations.
                    </span>
                  </label>

                  <button
                    id="next_signup_button"
                    type="submit"
                    disabled={!isEmailVarified}
                  >
                    Continue
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </button>
                </form>
              </div>
            )}

            {isBasicInfoCompleted && !createChannelVisible && (
              <div id="profile_img_dob_container">
                <div
                  id="back_arrow_button_basic"
                  onClick={() => {
                    setisBasicInfoCompleted(false);
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
                <div id="profile_img_dob_heading">
                  Enter Your Personal Information
                </div>
                <div
                  id="profile_container"
                  style={{
                    backgroundColor: profileImagePreview
                      ? "#ff0000"
                      : "#181818",
                  }}
                >
                  {profileImagePreview ? (
                    <img src={profileImagePreview} />
                  ) : (
                    <div id="default_profile_img">Z</div>
                  )}
                </div>
                <div id="profile_img_input_container">
                  <input
                    type="file"
                    name=""
                    id="profileimg"
                    onChange={(e) => {
                      ProfileImgReader(e);
                    }}
                  />
                  <label htmlFor="profileimg">Set your Profile Picture</label>
                </div>
                <div id="schedule_form_signup">
                  <div id="profile_img_dob_heading">
                    Enter Your Date of Birth
                  </div>
                  <input
                    type="date"
                    name=""
                    id="date"
                    value={dob}
                    onChange={(e) => {
                      setdob(e.target.value);
                    }}
                  />
                </div>
                <div
                  id="next_signup_button"
                  onClick={() => {
                    RegisterHandler();
                  }}
                >
                  Next
                </div>
              </div>
            )}

            {createChannelVisible && (
              <div id="signup_container">
                <div id="channel_form">
                  <div id="username_container" className="signup_form_elements">
                    <div id="signup_form_icon">
                      <i className="fa-regular fa-user"></i>
                    </div>
                    <label htmlFor="channelName">Channel Name</label>
                    <input
                      type="text"
                      name=""
                      id="channelName"
                      placeholder="Channel Name"
                      value={channelName}
                      onChange={(e) => {
                        setchannelName(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    id="channel_name_container"
                    className="signup_form_elements"
                  >
                    <div id="signup_form_icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <label htmlFor="channelDisc">Channel Discription</label>
                    <textarea
                      type="text"
                      name=""
                      id="channelDisc"
                      placeholder="Discription"
                      value={channelDisc}
                      onChange={(e) => {
                        setchannelDisc(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    id="first_last_name_container"
                    className="signup_form_elements"
                  >
                    <div className="name_container_element">
                      <div id="name_container_icon">
                        <i className="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="firstname">Country</label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => {
                          setcountry(e.target.value);
                        }}
                      >
                        {countryList.map((val) => (
                          <option key={val.name} value={val.name}>
                            {val.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="name_container_element">
                      <div id="name_container_icon">
                        <i className="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="lastname">Language</label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => {
                          setlanguage(e.target.value);
                        }}
                      >
                        {languageList.map((val) => (
                          <option key={val.language} value={val.language}>
                            {val.language}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    id="username_container"
                    className="signup_form_elements tags"
                  >
                    <div id="signup_form_icon">
                      <i className="fa-solid fa-key"></i>
                    </div>
                    <label htmlFor="lastname">Select Tags</label>
                    <Select
                      isMulti
                      options={tagsOptions}
                      value={selectedTags}
                      onChange={(selected) => setselectedTags(selected)}
                      placeholder="Select Tags"
                      className="custom-select"
                      classNamePrefix="custom-select"
                    />
                  </div>

                  <div id="cover_upload">
                    {!coverImagePreview ? (
                      <>
                        <label htmlFor="thumbnail">
                          <div>
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                          </div>
                          <p>Select Thumbnail from your Local Machine</p>
                        </label>
                        <input
                          type="file"
                          name="thumbnail"
                          id="thumbnail"
                          onChange={(e) => {
                            CoverFileHandler(e);
                          }}
                        />
                      </>
                    ) : (
                      <img
                        src={coverImagePreview}
                        alt=""
                        className="thumbnail_preview"
                      />
                    )}
                  </div>

                  <div
                    id="first_last_name_container"
                    className="signup_form_elements"
                  >
                    <div className="name_container_element">
                      <div id="name_container_icon">
                        <i className="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="firstname">Privacy</label>
                      <select
                        id="country"
                        value={channelPrivacy}
                        onChange={(e) => {
                          setchannelPrivacy(e.target.value);
                        }}
                      >
                        {privacy.map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="name_container_element color-picker">
                      <div id="name_container_icon">
                        <i className="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="lastname">Channel Theme</label>
                      <input
                        type="color"
                        name=""
                        id=""
                        value={colorTheme}
                        onChange={(e) => {
                          setcolorTheme(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  id="next_signup_button"
                  onClick={() => {
                    GenerateChannelHandler();
                  }}
                >
                  Next
                </div>
              </div>
            )}
          </>
        ) : (
          <div id="loading_div_signup">
            <Lottie animationData={AnimationData} loop={true} />
          </div>
        )}
      </div>
    </>
  );
}

export default SignUp;
