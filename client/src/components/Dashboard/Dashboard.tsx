import { useEffect, useState } from "react";
import "./Dashboard.css";
import Modal from "../Modal/Modal";
import { LoginSteps } from "../LoginSteps/LoginSteps";
import axios from "axios";
import config from "../../config/config";
import { useAppContext } from "../../context/AppContext";
import { Topics } from "../Topics/Topics";

export interface UserDetails {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  totalTopic: number | undefined;
  topicsAttempted: number;
  totalCorrectlyAnswered: number;
  totalQuestionAttempted: number;
}

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userDetails, updateUserDetail, event, updateEvent } = useAppContext();

  useEffect(() => {
    if (event === "ShowLoginBox") {
      setIsModalOpen(true);
      updateEvent("");
    }
  }, [event]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const guestLogin = async () => {
    try {
      const response = await axios.post(
        `${config.API_URL}/user/guestLogin`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status >= 200 && response.status < 300) {
        updateUserDetail(response.data);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || "An unknown error occurred");
    }
  };

  useEffect(() => {
    let timer: number | undefined;

    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/user/isLoggedIn`, {
          withCredentials: true,
        });
        if (response.status >= 200 && response.status < 300) {
          console.log(response.data);
          updateUserDetail(response.data);
        }
        if (response.data.email === "guest@gmail.com") {
          timer = window.setTimeout(() => {
            setIsModalOpen(true);
          }, 2000);
        }
      } catch (error) {
        timer = window.setTimeout(() => {
          guestLogin();
          setIsModalOpen(true);
        }, 2000);
      }
    };

    checkLoginStatus();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      <h2 className="welcomeMessage">
        Welcome {userDetails ? userDetails.name : "Guest"}, Select a topic to
        start your quiz <span>(Questions are AI Generated)</span>
      </h2>
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <LoginSteps onClose={handleModalClose} />
        </Modal>
      )}
      <div className="topicBox">
        <Topics />
      </div>
    </div>
  );
};
