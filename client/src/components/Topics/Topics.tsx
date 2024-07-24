import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Topics.css"; // Make sure to create and import this CSS file
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading/Loading";
import { useAppContext } from "../../context/AppContext";
import { shuffleArray } from "../Common/common";

export interface Topic {
  id: number;
  topic: string;
  description: string;
  image: string;
}

export const Topics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userDetails, updateUserDetail, updateTopics } = useAppContext();

  const handleStartQuiz = (topic: Topic) => {
    console.log(`Starting quiz for topic ${topic}`);
    navigate("/quiz", { state: topic });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/topic/all`);
        updateTopics(response.data);
        setTopics(response.data);
        if (userDetails) {
          updateUserDetail({
            ...userDetails,
            totalTopic: response.data.length,
          });
        }
      } catch (err) {
        setError("Failed to load topics");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const shuffledTopics = useMemo(() => shuffleArray(topics), [topics]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="topics-container">
        {shuffledTopics.map((topic) => (
          <div key={topic.id} className="topic-card">
            <div className="topic-card-absolute">
              <img
                src={topic.image}
                alt={topic.topic}
                className="topic-image"
              />
              <h3 className="topic-name">{topic.topic}</h3>
              <div className="topic-description-container">
                <p className="topic-description">{topic.description}</p>
                <button
                  className="start-quiz-button"
                  onClick={() => handleStartQuiz(topic)}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
