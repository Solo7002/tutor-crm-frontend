import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import TestForm from './components/TestForm/TestForm';
import AddQuestion from './components/AddQuestion/AddQuestion';
import { PrimaryButton } from '../../components/Buttons/Buttons';
import './CreateTest.css';
import { decryptData } from '../../utils/crypto';
import { toast } from 'react-toastify';

const CreateTest = () => {
  const navigate = useNavigate();
  const { encodedGroupId } = useParams();
  const [questions, setQuestions] = useState([1]);
  const [formData, setFormData] = useState({});
  const [questionsData, setQuestionsData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [GroupId, setGroupId] = useState();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    try {
      const decryptedGroupId = decryptData(encodedGroupId);
      setGroupId(decryptedGroupId);
    } catch (err) {
      toast.error("Сталася помилка, спробуйте ще раз");
    }
  }, [encodedGroupId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const newErrors = {};

    if (!formData.subject || formData.subject.trim() === '') {
      newErrors.subject = 'Тема тесту не може бути порожньою.';
    }

    if (!formData.numAttempts || parseInt(formData.numAttempts) < 1) {
      newErrors.numAttempts = 'Кількість спроб має бути числом >= 1.';
    }

    let timeInMinutes = 0;
    if (formData.time) {
      const timeValue = formData.time.trim();
      if (/^\d+$/.test(timeValue)) {
        timeInMinutes = parseInt(timeValue);
      } else if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
        const [minutes, seconds] = timeValue.split(':').map(Number);
        timeInMinutes = minutes + Math.floor(seconds / 60);
      } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeValue)) {
        const [hours, minutes, seconds] = timeValue.split(':').map(Number);
        timeInMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
      } else {
        newErrors.time = 'Некоректний формат часу. Використовуйте число (хвилини), MM:SS або HH:MM:SS.';
      }
    }
    if (timeInMinutes < 0) {
      newErrors.time = 'Час виконання не може бути від’ємним.';
    }

    if (!formData.maxScore || parseInt(formData.maxScore) < 0) {
      newErrors.maxScore = 'Максимальний бал має бути числом >= 0.';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не може бути меншим за сьогоднішню дату.';
      }
    } else {
      newErrors.deadline = 'Будь ласка, виберіть дедлайн.';
    }

    const validQuestions = Object.values(questionsData).filter((question) => {
      const hasQuestionText = question.questionText && question.questionText.trim() !== '';
      const hasValidOptions = question.options.filter((opt) => opt.trim() !== '').length >= 2;
      const hasCorrectAnswer = !!question.correctAnswer;
      return hasQuestionText || hasValidOptions || hasCorrectAnswer;
    });

    if (validQuestions.length === 0) {
      newErrors.questions = 'Будь ласка, додайте хоча б одне заповнене питання.';
    } else {
      validQuestions.forEach((question) => {
        const questionErrors = {};

        if (!question.questionText || question.questionText.trim() === '') {
          questionErrors.questionText = `Будь ласка, заповніть текст питання для завдання ${question.taskNumber}.`;
        }

        const validOptions = question.options.filter((opt) => opt.trim() !== '');
        if (validOptions.length < 2) {
          questionErrors.options = `Питання ${question.taskNumber} має мати принаймні 2 відповіді.`;
        } else {
          const optionErrors = [];
          question.options.forEach((opt, index) => {
            if (!opt.trim()) {
              optionErrors[index] = `Відповідь ${index + 1} не може бути порожньою.`;
            }
          });
          if (optionErrors.length > 0) {
            questionErrors.options = optionErrors;
          }
        }

        if (!question.correctAnswer) {
          questionErrors.correctAnswer = `Будь ласка, виберіть правильну відповідь для питання ${question.taskNumber}.`;
        }

        if (Object.keys(questionErrors).length > 0) {
          newErrors[`question${question.taskNumber}`] = questionErrors;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Будь ласка, виправте помилки у формі');
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      let timeLimitInMinutes = 0;
      if (formData.time) {
        const timeValue = formData.time.trim();
        if (/^\d+$/.test(timeValue)) {
          timeLimitInMinutes = parseInt(timeValue);
        } else if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
          const [minutes, seconds] = timeValue.split(':').map(Number);
          timeLimitInMinutes = minutes + Math.floor(seconds / 60);
        } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeValue)) {
          const [hours, minutes, seconds] = timeValue.split(':').map(Number);
          timeLimitInMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
        }
      }
     
      const testPayload = {
        TestName: formData.subject,
        TestDescription: formData.description,
        TimeLimit: timeLimitInMinutes,
        CreatedDate: new Date().toISOString().split('T')[0],
        DeadlineDate: formData.deadline || null,
        MaxMark: parseInt(formData.maxScore) || 0,
        ImageFilePath: null,
        GroupId: GroupId,
        AttemptsTotal: parseInt(formData.numAttempts) || 1,
        ShowAnswers: formData.showAnswersAfterTest || false,
      };

      const testResponse = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/tests`, testPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const testId = testResponse.data.TestId;

      if (!testId) {
        throw new Error('Не вдалося отримати TestId');
      }

      const questionsPayload = await Promise.all(
        validQuestions.map(async (question) => {
          let fileUrl = null;
          if (question.questionImage) {
            const formDataForImage = new FormData();
            formDataForImage.append('file', question.questionImage);

            try {
              const imageResponse = await axios.post(
                `${process.env.REACT_APP_BASE_API_URL}/api/files/upload`,
                formDataForImage,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                },
                }
              );
              fileUrl = imageResponse.data.fileUrl;
            } catch (error) {
              throw new Error('Не вдалося завантажити зображення: ' + (error.message || error));
            }
          }

          const questionData = {
            TestId: testId,
            TestQuestionHeader: `${question.questionText.trim()}`,
            TestQuestionDescription: `    `,
            ImagePath: fileUrl,
            AudioPath: null,
          };

          const questionResponse = await axios.post(
            `${process.env.REACT_APP_BASE_API_URL}/api/testQuestions`,
            questionData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const testQuestionId = questionResponse.data.TestQuestionId;

          if (!testQuestionId) {
            throw new Error('Не вдалося отримати TestQuestionId');
          }

          const answers = question.options
            .filter((option) => option.trim() !== '')
            .map((option, index) => ({
              TestQuestionId: testQuestionId,
              AnswerText: option,
              IsRightAnswer: question.correctAnswer === (index + 1).toString(),
              ImagePath: null,
            }));

          for (const answer of answers) {
            await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/testAnswers`, answer, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          return {
            ...questionData,
            TestQuestionId: testQuestionId,
            answers,
          };
        })
      );

      toast.success(
        <div>
          <p>Тест успішно створено!</p>
          <p>Назва: {formData.subject}</p>
          <p>Група: {questionsPayload[0]?.answers[0]?.TestQuestionId ? 'Невідома' : 'Невідома'}</p>
        </div>,
        { autoClose: 5000 }
      );

      setTimeout(() => {
        navigate('/teacher/tests');
        navigate(0);
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Виникла помилка при створенні тесту';
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

 const addNewQuestion = () => {
    setQuestions((prevQuestions) => [...prevQuestions, prevQuestions.length + 1]);
  };

  const removeQuestion = (questionNumber) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((q) => q !== questionNumber);
      setQuestionsData((prevData) => {
        const newData = { ...prevData };
        delete newData[questionNumber];
        return newData;
      });
      return updatedQuestions.map((_, index) => index + 1);
    });
  };

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleQuestionChange = (taskNumber, data) => {
    setQuestionsData((prevData) => ({
      ...prevData,
      [taskNumber]: data,
    }));
  };

  return (
    <div className="test-page-container w-full max-w-[900px] mx-auto px-4 sm:px-6">
      <TestForm
        defaultNumQuestions={`${questions.length}`}
        onFormChange={handleFormChange}
        errors={errors}
        createdQuestionsAmount={questions.length}
      />
  
      <div className="questions-container mt-4 sm:mt-6 md:mt-8">
        <div className="questions-section space-y-4 sm:space-y-6">
          {questions.map((questionNumber) => (
            <div key={questionNumber} className="relative">
              <AddQuestion
                taskNumber={questionNumber}
                onQuestionChange={handleQuestionChange}
                errors={errors[`question${questionNumber}`]}
              />
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(questionNumber)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
  
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 mb-24">
        <PrimaryButton
          onClick={addNewQuestion}
          className="w-full sm:w-auto sm:flex-1 max-w-md mx-auto sm:mx-0 bg-purple-500 hover:bg-purple-600"
        >
          Додати ще одне запитання
        </PrimaryButton>
  
        <PrimaryButton
          className="w-full sm:w-auto sm:flex-1 max-w-md mx-auto sm:mx-0"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Зберігається...' : 'Створити'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CreateTest;