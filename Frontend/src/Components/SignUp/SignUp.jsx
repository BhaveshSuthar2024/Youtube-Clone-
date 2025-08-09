import React, { useEffect, useState, useContext } from "react";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { countryList, languageList, tags, privacy } from "../../Utils/data.js";
import Select from "react-select";
import StateContext from "../../Context/StateContext";
import Lottie from "lottie-react";
import AnimationData from "../../../public/Animation.json";

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
  const [otp, setotp] = useState('')

  const navigate = useNavigate();
  const { setrefetchUser } = useContext(StateContext);

  const ProfileImgReader = (e) => {
    const file = e.target.files[0];
    setprofileImgLoacalPath(file);
    console.log(file);

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

    const BaseUrl = "http://localhost:3000/api";

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

    console.log(
      firstname,
      lastname,
      username,
      email,
      password,
      confirmPassword,
      dob,
      profileImgLoacalPath,
    );

    try {
      const response = await axios.post(`${BaseUrl}/v1/auth/signup`, formdata, {
        withCredentials: true,
      });
      console.log(response);
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
    console.log(
      channelName,
      channelDisc,
      country,
      language,
      selectedTags,
      coverImage,
      channelPrivacy,
      colorTheme,
    );

    const BaseUrl = "http://localhost:3000/api";

    const formdata = new FormData();

    formdata.append("name", channelName);
    formdata.append("discription", channelDisc);
    formdata.append("coverImage", coverImage);
    formdata.append("country", country);
    formdata.append("language", language);
    formdata.append("themeColor", colorTheme);
    formdata.append("privacy", channelPrivacy);
    

    try {
      const response = await axios.post(
        `${BaseUrl}/v1/channel/createChannel`,
        formdata,
        { withCredentials: true },
      );
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const generateOTP = async() => {

    const BaseUrl = "http://localhost:3000/api";
    try {
      const response = await axios.post(`${BaseUrl}/v1/auth/generateOTP`, {email: email});
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const validateOTP = async() => {

    const BaseUrl = "http://localhost:3000/api";
    try {
      const response = await axios.post(`${BaseUrl}/v1/auth/validateOTP`, {email: email, otp: otp});
      console.log(response);
      setisEmailVarified(response?.data?.isEmailVarified);
      console.log(" : - ",response?.data?.isEmailVarified); 
    } catch (error) {
      console.log(error);
    }
  }

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
                  <i class="fa-solid fa-arrow-left"></i>
                </div>
                <div id="signup_heading">Register</div>
                <div id="register_with_Google_container">
                  <div id="register_with_Google_icon_container">
                    <img src="search.png" alt="" />
                  </div>
                  <div id="register_with_Google_text">Register With Google</div>
                </div>
                <div id="partition">
                  <div id="partition_text">or</div>
                </div>
                <div id="signup_form">
                  <div
                    id="first_last_name_container"
                    className="signup_form_elements"
                  >
                    <div className="name_container_element">
                      <div id="name_container_icon">
                        <i class="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="firstname">First Name</label>
                      <input
                        type="text"
                        name=""
                        id="firstname"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => {
                          setfirstname(e.target.value);
                        }}
                      />
                    </div>
                    <div className="name_container_element">
                      <div id="name_container_icon">
                        <i class="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="lastname">Last Name</label>
                      <input
                        type="text"
                        name=""
                        id="lastname"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => {
                          setlastname(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div id="username_container" className="signup_form_elements">
                    <div id="signup_form_icon">
                      <i class="fa-regular fa-user"></i>
                    </div>
                    <label htmlFor="lastname">Username</label>
                    <input
                      type="text"
                      name=""
                      id="lastname"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => {
                        setusername(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    id="first_last_name_container"
                    className="signup_form_elements"
                  >
                    <div className="name_container_element_email">
                      <div id="signup_form_icon">
                        <i class="fa-solid fa-envelope"></i>
                      </div>
                      <label htmlFor="lastname">Email</label>
                      <input
                        type="text"
                        name=""
                        id="lastname"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setemail(e.target.value);
                        }}
                      />
                      <div id="get_otp" onClick={() => {generateOTP()}}>Get OTP</div>
                    </div>
                    <div className="name_container_element_otp">
                      <label htmlFor="lastname">Enter OTP</label>
                      <input
                        type="number"
                        name=""
                        id="lastname"
                        placeholder="OTP"
                        value={otp}
                        min="100000" max="999999"
                        onChange={(e) => {
                          setotp(e.target.value);
                        }}
                      />
                      <div id="submit_otp" onClick={() => {validateOTP()}}>Submit</div>
                    </div>
                  </div>

                  <div id="username_container" className="signup_form_elements">
                    <div id="signup_form_icon">
                      <i class="fa-solid fa-key"></i>
                    </div>
                    <label htmlFor="lastname">Password</label>
                    <input
                      type="text"
                      name=""
                      id="lastname"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setpassword(e.target.value);
                      }}
                    />
                  </div>

                  <div id="username_container" className="signup_form_elements">
                    <div id="signup_form_icon">
                      <i class="fa-solid fa-key"></i>
                    </div>
                    <label htmlFor="lastname">Confirm Password</label>
                    <input
                      type="text"
                      name=""
                      id="lastname"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setconfirmPassword(e.target.value);
                      }}
                    />
                  </div>

                  <div id="permission_select_container_signup">
                    <input type="checkbox" name="permission" id="permission" />
                    <label
                      htmlFor="permission"
                      onClick={() => {
                        setpermission((prev) => !prev);
                      }}
                    >
                      I Accept all the platform guidelines. I will not perform
                      anything that is against platform regulation.
                    </label>
                  </div>
                </div>

                <div
                  id="next_signup_button"
                  onClick={() => {
                    setisBasicInfoCompleted(true);
                  }}
                >
                  Next
                </div>
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
                  <i class="fa-solid fa-arrow-left"></i>
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
                      <i class="fa-regular fa-user"></i>
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
                      <i class="fa-solid fa-envelope"></i>
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
                        <i class="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="firstname">Country</label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => {
                          setcountry(e.target.value);
                        }}
                      >
                        {countryList.map((val, key) => (
                          <>
                            <option value={val.name}>{val.name}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="name_container_element">
                      <div id="name_container_icon">
                        <i class="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="lastname">Language</label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => {
                          setlanguage(e.target.value);
                        }}
                      >
                        {languageList.map((val, key) => (
                          <>
                            <option value={val.language}>{val.language}</option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    id="username_container"
                    className="signup_form_elements tags"
                  >
                    <div id="signup_form_icon">
                      <i class="fa-solid fa-key"></i>
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
                        <i class="fa-solid fa-pencil"></i>
                      </div>
                      <label htmlFor="firstname">Privacy</label>
                      <select
                        id="country"
                        value={channelPrivacy}
                        onChange={(e) => {
                          setchannelPrivacy(e.target.value);
                        }}
                      >
                        {privacy.map((val, key) => (
                          <>
                            <option value={val}>{val}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="name_container_element color-picker">
                      <div id="name_container_icon">
                        <i class="fa-solid fa-pencil"></i>
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
