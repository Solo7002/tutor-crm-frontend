import React from "react";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import "./RunTestStudent.css"; // Подключаем CSS-файл

export default function RunTestStudent() {
  const currentQuestionIndex = 1;
  const totalQuestions = 12;
  const remainingTime = "00:25:30";
  const progressPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);

  const questionText = "Скільки осей має прямокутна система координат у двовимірному просторі?";
  const imageUrl = "https://via.placeholder.com/300";
  const answers = ["Одна", "Дві", "Три", "Чотири"];

  return (
    <div className="test-page-container">
      <header className="header">
        <button className="back-button">
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7H15M1 7L7 13M1 7L7 1"
              stroke="#120C38"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="progress-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-text">
            <div className="progress-value">
              {currentQuestionIndex}/{totalQuestions}
            </div>
            <div className="progress-value">{remainingTime}</div>
          </div>
        </div>
      </header>

      <main className="main">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Иллюстрация к вопросу"
            className="max-w-[50%] h-auto mb-4"
          />
        )}
        <div className="question-text">{questionText}</div>
      </main>

      <footer className="footer">
        <div className="h-full flex flex-col justify-between">
          <div className="answers-grid">
            {answers.map((answer, index) => (
              <button key={index} className="answer-button">
                <div className="answer-text">{answer}</div>
              </button>
            ))}
          </div>
          <div className="primary-button-container">
            <PrimaryButton>Далі</PrimaryButton>
          </div>
        </div>
      </footer>
    </div>
  );
}
