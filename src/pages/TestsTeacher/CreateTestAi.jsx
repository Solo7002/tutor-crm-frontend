import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import WaitModal from "./components/WaitModal/WaitModal";
import TestForm from "./components/TestForm/TestForm";
import AddQuestion from "./components/AddQuestion/AddQuestion";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { decryptData } from '../../utils/crypto';
import { option } from "motion/react-client";

const CreateTestAi = () => {
  const navigate = useNavigate();

  const { encodedGroupId } = useParams();
  const [formData, setFormData] = useState({});
  const [questionsData, setQuestionsData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});
  const [generated, setGenerated] = useState(false);
  const [GroupId, setGroupId] = useState();

  const abortControllerRef = useRef(null);
  const token=sessionStorage.getItem('token');
  useEffect(() => {
    try {
      const decryptedGroupId = decryptData(encodedGroupId);
      setGroupId(decryptedGroupId);
    } catch (err) {
      console.log(err.message);
    }
  }, [encodedGroupId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrors({});

    const newErrors = {};
    if (!formData.subject || formData.subject.trim() === '') {
      newErrors.subject = 'Тема тесту не може бути порожньою.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsGenerating(false);
      return;
    }

    try {
      
      const response = await axios.post(
        'http://localhost:4000/api/tests/generate-test-by-AI',
        {
          text: `${formData.subject} ${formData.description} `,
          language: 'ua',
          count: parseInt(formData.numQuestions) || 5,
        },
        
      );

      const generatedQuestions = response.data.questions;

      const formattedQuestions = generatedQuestions.reduce((acc, q, index) => {
        const taskNumber = index + 1;
        acc[taskNumber] = {
          taskNumber,
          questionText: q.question,
          options: q.options.map((opt, optIndex) => ({
            id: optIndex + 1,
            value: opt,
          })),
          correctAnswer: (q.options.indexOf(q.correct) + 1).toString(),
          questionImage: null,
        };
        return acc;
      }, {});

      setQuestionsData(formattedQuestions);
      setGenerated(true);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Генерація була скасована');
      } else {
        console.error('Помилка генерації:', error);
        setErrors({ general: 'Не вдалося згенерувати тест: ' + (error.message || error) });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    navigate('/teacher/tests');
  };

  const handleSubmit = async () => {
    console.log("1");
    setIsSubmitting(true);
    const newErrors = {};
    console.log("2");

    if (!formData.subject || formData.subject.trim() === '') {
      newErrors.subject = 'Тема тесту не може бути порожньою.';
    }
    console.log("3");

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

    if (!formData.numAttempts || parseInt(formData.numAttempts) < 1) {
      newErrors.numAttempts = 'Кількість спроб має бути числом >= 1.';
    }

    if (!formData.maxScore || parseInt(formData.maxScore) < 0) {
      newErrors.maxScore = 'Максимальний бал має бути числом >= 0.';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Будь ласка, виберіть дедлайн.';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не може бути меншим за сьогоднішню дату.';
      }
    }
 

    if (Object.keys(questionsData).length === 0) {
      newErrors.questions = 'Будь ласка, згенеруйте тест перед створенням.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
     
      
      const testPayload = {
        TestName: formData.subject,
        TestDescription: formData.description,
        TimeLimit: timeInMinutes,
        CreatedDate: new Date().toISOString().split('T')[0],
        DeadlineDate: formData.deadline || null,
        MaxMark: parseInt(formData.maxScore) || 0,
        ImageFilePath: null,
        GroupId: GroupId,
        AttemptsTotal: parseInt(formData.numAttempts) || 1,
        ShowAnswers: formData.showAnswersAfterTest || false,
      };

      const testResponse = await axios.post('http://localhost:4000/api/tests', testPayload,{
        headers: {
           Authorization: `Bearer ${token}`,
        },
      });
      const testId = testResponse.data.TestId;

      if (!testId) {
        throw new Error('Не вдалося отримати TestId');
      }

      console.log(questionsData);
      
      const questionsPayload = await Promise.all(
        Object.values(questionsData).map(async (question) => {
          let fileUrl = null;
      
          if (question.questionImage) {
            const formDataForImage = new FormData();
            formDataForImage.append('file', question.questionImage);
      
            try {
              const imageResponse = await axios.post(
                'http://localhost:4000/api/files/upload',
                formDataForImage,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
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
            TestQuestionHeader: question.questionText.trim(),
            TestQuestionDescription: '  ',
            ImagePath: fileUrl,
            AudioPath: null,
          };
      
          const questionResponse = await axios.post(
            'http://localhost:4000/api/testQuestions',
            questionData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
            await axios.post(
              'http://localhost:4000/api/testAnswers',
              answer,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
      
          return {
            ...questionData,
            TestQuestionId: testQuestionId,
            answers,
          };
        })
      );
      

      navigate('/teacher/tests');
      navigate(0);
    } catch (error) {
      console.error('Помилка:', error);
      setErrors({ general: 'Виникла помилка при створенні тесту: ' + (error.message || error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = useCallback((data) => {
    setFormData(data);
  }, []);

  const handleQuestionChange = useCallback((taskNumber, data) => {
    setQuestionsData((prevData) => ({
      ...prevData,
      [taskNumber]: data,
    }));
  }, []);

  return (
    <div className="test-page-container">
      <TestForm
        defaultNumQuestions="5"
        onFormChange={handleFormChange}
        errors={errors}
      />

      {generated && (
        <div className="questions-container mt-4">
          <div className="questions-section space-y-6">
            {Object.entries(questionsData).map(([taskNumber, question]) => (
              <AddQuestion
                key={taskNumber}
                taskNumber={parseInt(taskNumber)}
                onQuestionChange={handleQuestionChange}
                initialData={question}
                errors={errors[`question${taskNumber}`]}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6 mb-24 flex-wrap">
        {!generated ? (
          <PrimaryButton
            className="w-96 max-w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Генерується...' : 'Згенерувати'}
          </PrimaryButton>
        ) : (
          <>
            <PrimaryButton
              className="w-96 max-w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Зберігається...' : 'Створити'}
            </PrimaryButton>
            <PrimaryButton
              className="w-96 max-w-full bg-purple-500 hover:bg-purple-600"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Генерується...' : 'Згенерувати заново'}
            </PrimaryButton>
          </>
        )}
      </div>

      <WaitModal isOpen={isGenerating} onClose={handleCancelGeneration} />
    </div>
  );
};

export default CreateTestAi;