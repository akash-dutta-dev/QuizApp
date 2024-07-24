import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import axios from "axios";
import config from "../../config/config";
import "./Navbar.css";
import { useAppContext } from "../../context/AppContext";
import { Topic } from "../Topics/Topics";

export const Navbar = () => {
  const navigate = useNavigate();
  const { userDetails, updateUserDetail, updateEvent, topics } =
    useAppContext();
  const [searchInput, setSearchInput] = useState("");
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const results = topics.filter((topic) =>
      topic.topic.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredTopics(results.slice(0, 3));
  }, [searchInput, topics]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setIsSearchOpen(true); // Open search results on input change
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleHelpClick = () => {
    navigate("/help");
  };

  const handleLogoutClick = async () => {
    if (userDetails && userDetails.email !== "guest@gmail.com") {
      try {
        await axios.post(
          `${config.API_URL}/user/logout`,
          {},
          { withCredentials: true }
        );
        alert("Logout Successful");
        navigate("/");
        updateUserDetail();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      updateEvent("ShowLoginBox");
    }
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        QuizApp
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for quizzes..."
          value={searchInput}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchOpen(true)} // Keep open when focused
        />
      </div>
      <div className="icons">
        <IoMdHelpCircleOutline
          size={24}
          title="Help"
          onClick={handleHelpClick}
        />
        <FaUserCircle size={24} title="Profile" onClick={handleProfileClick} />
        <FaPowerOff size={24} title="Logout" onClick={handleLogoutClick} />
      </div>
      {isSearchOpen && searchInput && (
        <div className="search-results" ref={searchRef}>
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="search-result-item">
              <img
                src={topic.image}
                alt={topic.topic}
                className="search-topic-image"
              />
              <div className="search-result-details">
                <h3 className="search-topic-name">{topic.topic}</h3>
                <p className="search-topic-description">{topic.description}</p>
                <button
                  className="search-start-quiz-button"
                  onClick={() => {
                    console.log("Start quiz for topic:", topic.topic);
                    navigate("/quiz", { state: topic });
                    setIsSearchOpen(false); // Close the search results
                  }}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
