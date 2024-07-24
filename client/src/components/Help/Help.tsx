import "./Help.css";

export const Help = () => {
  return (
    <div className="help-container">
      <h1>Help & Support</h1>
      <p className="description">
        Welcome to the QuizApp ! Here you'll find diverse topics of quizes
        challenges to solve and learn more about unique facts. Whether you're a
        new user or a seasoned pro, we guarantee you will have a great time
        solving quizes here with learning every step.
      </p>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How do I start a quiz?</h3>
          <p>
            To start a quiz, navigate to the Dashboard section from the nav bar.
            You'll be able to select your quiz topic and start the quiz.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I create a quiz topic?</h3>
          <p>
            Yes, send us a mail about the topic you want to add. If its a
            interesting topic, we will add it as soon as possible
          </p>
        </div>
        <div className="faq-item">
          <h3>What should I do if I encounter a problem?</h3>
          <p>
            If you encounter any issues, dont panic, your progress will be
            saved. Try again later. If the issue persist, contact us using the
            below contact details
          </p>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you need further assistance, don't hesitate to reach out to us:
        </p>
        <ul>
          <li>Email: quizapp@gmail.com</li>
          <li>Phone: +91 9876 543 210</li>
        </ul>
      </section>
    </div>
  );
};
