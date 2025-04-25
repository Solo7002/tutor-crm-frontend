import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PrimaryButton } from "../../components/Buttons/Buttons";
import { decryptData } from '../../utils/crypto';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function RunTestStudent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { encryptedTestId } = useParams();

  const [doneTestId, setDoneTestId] = useState(null);
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const timerRef = useRef(null);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    const decryptedTestId = decryptData(encryptedTestId);
    setDoneTestId(decryptedTestId);

    axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/tests/testByDoneTest/${decryptedTestId}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
    })
      .then(response => {
        setTestData(response.data);
        setTimeRemaining(response.data.TimeLimit * 60);
      })
      .catch(error => {
        toast.error(t("Tests.RunTestStudent.errorFetchingTest"));
      });
  }, [encryptedTestId, t]);

  useEffect(() => {
    if (!testData) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          alert(t("Tests.RunTestStudent.timeExpired"));
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [testData, t]);

  useEffect(() => {
    if (testData && currentQuestionIndex >= testData.TestQuestions.length && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      clearInterval(timerRef.current);

      const initialTimeInSeconds = testData.TimeLimit * 60;
      const timeTakenInSeconds = initialTimeInSeconds - timeRemaining;
      const timeTakenFormatted = formatTime(timeTakenInSeconds);

      const dataToSend = {
        answers: selectedAnswers,
        timeTaken: timeTakenFormatted
      };

      axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/doneTests/${doneTestId}/mark`, dataToSend, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
      })
        .then(response => {
          navigate(`/student/tests/complete/${encryptedTestId}`);
        })
        .catch(error => {
          toast.error(t("Tests.RunTestStudent.errorSubmittingTest"));
        });
    }
  }, [currentQuestionIndex, testData, timeRemaining, selectedAnswers, doneTestId, encryptedTestId, navigate, t]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (timeInSeconds >= 3600) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  if (!testData) {
    return <div>{t("Tests.RunTestStudent.loading")}</div>;
  }

  const totalQuestions = testData.TestQuestions.length;

  if (currentQuestionIndex >= totalQuestions) {
    return <div>{t("Tests.RunTestStudent.testCompleted")}</div>;
  }

  const currentQuestion = testData.TestQuestions[currentQuestionIndex];
  const questionText = currentQuestion.TestQuestionHeader;
  const imageUrl = currentQuestion.ImagePath;
  const answers = currentQuestion.testAnswers;

  const progressPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);

  const handleNext = () => {
    if (selectedAnswerId !== null) {
      setSelectedAnswers(prev => [
        ...prev,
        {
          testQuestionId: currentQuestion.TestQuestionId,
          testAnswerId: selectedAnswerId,
          doneTestId: doneTestId
        }
      ]);
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerId(null);
    } else {
      alert(t("Tests.RunTestStudent.pleaseSelectAnswer"));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-purple-50">
      {/* Header */}
      <header className="h-auto md:h-[8%] relative bg-white w-full py-2 md:py-4 px-4 md:px-20 shadow-md flex items-center">
        <button className="absolute top-1/2 -translate-y-1/2 left-2 md:left-5 text-gray-700 mr-4">
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

        <div className="flex-1 flex flex-col mt-2 ml-6 md:ml-0">
          <div className="w-full bg-gray-200 h-3 rounded-full mb-1">
            <div
              className="bg-[#8a48e6] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <div className="text-[#8a48e6] text-lg md:text-2xl font-bold font-['Nunito']">
              {currentQuestionIndex + 1}/{totalQuestions}
            </div>
            <div className="text-[#8a48e6] text-lg md:text-2xl font-bold font-['Nunito']">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-purple-100 flex flex-col items-center justify-center px-4 py-4 md:py-8">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={t("Tests.RunTestStudent.imageAlt")}
            className="max-w-full md:max-w-[50%] h-auto mb-4"
          />
        )}
        <div className="text-black text-xl md:text-2xl text-center font-bold font-['Nunito']">
          {questionText}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-lg w-full px-4 md:px-20 pt-4 md:pt-6 pb-2 h-auto md:h-[32%]">
        <div className="h-full flex flex-col justify-center">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:gap-4 gap-2 h-full md:grid-cols-${answers.length}`}>
            {answers.map((answer) => (
              <button
                key={answer.TestAnswerId}
                className={`outline outline-1 outline-[#8A48E6] p-2 md:p-4 rounded-[10px] text-center whitespace-normal break-words cursor-pointer transition h-auto md:h-[90%] ${selectedAnswerId === answer.TestAnswerId ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                onClick={() => setSelectedAnswerId(answer.TestAnswerId)}
              >
                <div className="text-lg md:text-2xl font-bold font-['Nunito']">
                  {answer.AnswerText}
                </div>
              </button>
            ))}
          </div>
          <div className="w-full md:w-[55%] mx-auto mt-4 md:mt-6">
            <PrimaryButton onClick={handleNext}>{t("Tests.RunTestStudent.nextButton")}</PrimaryButton>
          </div>
        </div>
      </footer>
    </div>
  );
}