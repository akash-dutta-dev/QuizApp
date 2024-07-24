import { useEffect, useState } from "react";
import axios from "axios";
import "./Quiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config/config";
import { Loading } from "../Loading/Loading";

export interface Question {
  id: number;
  question: string;
  options: string[];
}

export const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timer, setTimer] = useState(1800); // 30 minutes in seconds
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state;

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!topic || Object.keys(topic).length === 0) {
        navigate("/");
        return;
      }

      await axios
        .post(
          `${config.API_URL}/question/generateQuestion`,
          { ...topic },
          { withCredentials: true }
        )
        .then((response) => {
          setQuestions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoading(false);
          navigate("/");
          alert("Something went wrong. Try again.");
        });
    };

    fetchQuestions();

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return (event.returnValue = ""); // This is required for some browsers to show the alert
    };

    window.addEventListener("beforeunload", handleBeforeUnload, {
      capture: true,
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload, {
        capture: true,
      });
    };
  }, []);

  const handleOptionChange = (questionId: number, option: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, questions.length - 1)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSubmit = async () => {
    // Combine all answers and submit them
    const combinedAnswers = questions.map((question) => ({
      questionId: question.id,
      answer: answers[question.id] || "",
    }));

    try {
      const response = await axios.post(
        `${config.API_URL}/score/submit`,
        {
          topicId: topic.id,
          answers: combinedAnswers,
        },
        { withCredentials: true }
      );
      if (response.status >= 200 && response.status < 300) {
        navigate("/thank-you", { state: response.data });
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="quiz-container">
      <div className="timer">
        Time left: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
        {timer % 60}
      </div>
      <div className="question">
        <h2>
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p>{questions[currentIndex].question}</p>
        <ul className="options">
          {questions[currentIndex].options.map((option) => (
            <li key={option} className="option">
              <label>
                <input
                  type="radio"
                  name={`question-${questions[currentIndex].id}`}
                  value={option}
                  checked={answers[questions[currentIndex].id] === option}
                  onChange={() =>
                    handleOptionChange(questions[currentIndex].id, option)
                  }
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="navigation-buttons-next"
        >
          Next
        </button>
      </div>
      {currentIndex === questions.length - 1 && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      )}
    </div>
  );
};
