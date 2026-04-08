import React, { useEffect, useState } from "react";
import { Trophy, Clock, RotateCcw, User } from "lucide-react";
import "./App.css";

const questionBank = {
  HTML: [
    {
      question: "HTML stands for?",
      options: [
        "Hyper Text Markup Language",
        "High Text Language",
        "Hyperlinks Text",
        "None"
      ],
      answer: "Hyper Text Markup Language"
    },
    {
      question: "Which tag is used for hyperlinks?",
      options: ["<a>", "<link>", "<href>", "<p>"],
      answer: "<a>"
    }
  ],
  CSS: [
    {
      question: "Which CSS property changes text color?",
      options: ["font-color", "text-color", "color", "foreground"],
      answer: "color"
    },
    {
      question: "Which property is used for spacing inside an element?",
      options: ["margin", "padding", "border", "gap"],
      answer: "padding"
    }
  ],
  JavaScript: [
    {
      question: "Which keyword is used to declare a variable?",
      options: ["var", "int", "define", "string"],
      answer: "var"
    },
    {
      question: "Which method selects element by ID?",
      options: [
        "getElementById()",
        "queryElement()",
        "selectById()",
        "findById()"
      ],
      answer: "getElementById()"
    }
  ]
};

function App() {
  const [username, setUsername] = useState("");
  const [tempName, setTempName] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    if (!category || finished || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleNext(true);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [category, current, finished, questions]);

  const startQuiz = () => {
    if (!tempName.trim()) return;
    setUsername(tempName);
  };

  const selectCategory = (cat) => {
    setCategory(cat);
    setQuestions(questionBank[cat]);
    setCurrent(0);
    setScore(0);
    setSelected("");
    setFinished(false);
    setTimeLeft(15);
  };

  const handleSubmit = () => {
    if (!selected) return;

    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    handleNext(false);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected("");
      setTimeLeft(15);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const newEntry = {
      username,
      category,
      score,
      total: questions.length,
      date: new Date().toLocaleString()
    };

    const updatedHistory = [newEntry, ...history];
    localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    setFinished(true);
  };

  const restartQuiz = () => {
    setCategory("");
    setQuestions([]);
    setCurrent(0);
    setSelected("");
    setScore(0);
    setFinished(false);
    setTimeLeft(15);
  };

  const progress =
    questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <div className="app">
      <div className="container">
        <h1>Interactive Quiz Platform</h1>
        <p className="subtitle">Internship-Level Quiz Website</p>

        {!username && (
          <div className="card">
            <div className="icon-title">
              <User size={22} />
              <h2>Enter Your Name</h2>
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="input"
            />
            <button className="btn" onClick={startQuiz}>
              Continue
            </button>
          </div>
        )}

        {username && !category && (
          <div className="card">
            <h2>Welcome, {username} 👋</h2>
            <p>Select a category to start the quiz</p>
            <div className="category-grid">
              {Object.keys(questionBank).map((cat) => (
                <button
                  key={cat}
                  className="category-btn"
                  onClick={() => selectCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {category && !finished && questions.length > 0 && (
          <div className="card">
            <div className="top-bar">
              <span className="badge">{category}</span>
              <span className="timer">
                <Clock size={18} /> {timeLeft}s
              </span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <p className="question-count">
              Question {current + 1} of {questions.length}
            </p>

            <h2 className="question">{questions[current].question}</h2>

            <div className="options">
              {questions[current].options.map((opt, index) => (
                <button
                  key={index}
                  className={`option ${selected === opt ? "selected" : ""}`}
                  onClick={() => setSelected(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="bottom-bar">
              <p className="score">Current Score: {score}</p>
              <button className="btn" onClick={handleSubmit} disabled={!selected}>
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {finished && (
          <div className="card result-card">
            <Trophy size={50} className="trophy" />
            <h2>Quiz Completed!</h2>
            <p className="result-text">
              {username}, you scored <strong>{score}</strong> out of{" "}
              <strong>{questions.length}</strong> in <strong>{category}</strong>
            </p>
            <button className="btn restart-btn" onClick={restartQuiz}>
              <RotateCcw size={18} /> Restart Quiz
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="card history-card">
            <h2>Quiz History</h2>
            <div className="history-list">
              {history.slice(0, 5).map((item, index) => (
                <div key={index} className="history-item">
                  <p>
                    <strong>{item.username}</strong> - {item.category}
                  </p>
                  <p>
                    Score: {item.score}/{item.total}
                  </p>
                  <span>{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;