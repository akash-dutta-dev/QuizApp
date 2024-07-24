import { useLocation, useNavigate } from "react-router-dom";
import "./ThankYou.css";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctOption: string;
  answer: string;
}

interface ThankYouProps {
  questions: Question[];
  totalQuestion: number;
  totalCorrect: number;
}

export const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submitResponse: ThankYouProps = location.state;

  // Navigate to the dashboard
  const handleDashboardClick = () => {
    navigate("/");
  };

  return (
    <div className="thank-you-container">
      <h1>Thank You for Attempting the Quiz!</h1>
      <p>
        Your score: {submitResponse.totalCorrect} /{" "}
        {submitResponse.totalQuestion}
      </p>
      <button className="dashboard-button" onClick={handleDashboardClick}>
        Go to Dashboard
      </button>
      <div className="questions-review">
        {submitResponse.questions.map((question) => (
          <div key={question.id} className="question-container">
            <h2>{question.question}</h2>
            <ul className="options-list">
              {question.options.map((option) => {
                const isCorrect = option === question.correctOption;
                const isUserAnswer = option === question.answer;
                return (
                  <li
                    key={option}
                    className={`option-item ${
                      isCorrect ? "correct" : isUserAnswer ? "incorrect" : ""
                    }`}
                  >
                    {option}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
