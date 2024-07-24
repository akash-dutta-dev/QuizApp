import { useEffect } from "react";
import "./Profile.css";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import profilePic from "./profile-pic.jpg";

export const Profile = () => {
  const { userDetails, updateUserDetail } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails || userDetails?.email !== "guest@gmail.com") {
      const checkLoginStatus = async () => {
        try {
          const response = await axios.get(
            `${config.API_URL}/user/isLoggedIn`,
            {
              withCredentials: true,
            }
          );
          if (response.status >= 200 && response.status < 300) {
            console.log(response.data);
            updateUserDetail(response.data);
          }
        } catch (error) {
          alert("Something went wrong. PLease login to visit profile");
          navigate("/");
        }
      };

      checkLoginStatus();
    } else {
      alert("Something went wrong. PLease login to visit profile");
      navigate("/");
    }
    console.log(userDetails);
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="stats">
          <p className="stat">
            Topics Attempted:{" "}
            <span>
              {userDetails?.topicsAttempted} / {userDetails?.totalTopic}
            </span>
          </p>
          <p className="stat">
            Correct Answers:{" "}
            <span>
              {userDetails?.totalCorrectlyAnswered} /{" "}
              {userDetails?.totalQuestionAttempted}
            </span>
          </p>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-image">
          <img src={profilePic} alt="Profile" />
        </div>
        <div className="profile-details">
          <h1>{userDetails?.name}</h1>
          <p>Email: {userDetails?.email}</p>
          <p>
            Status: {userDetails?.isEmailVerified ? "Verified" : "Not Verified"}
          </p>
        </div>
      </div>
    </div>
  );
};
