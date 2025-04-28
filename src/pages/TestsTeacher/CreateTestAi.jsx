import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import WaitModal from "./components/WaitModal/WaitModal";
import TestForm from "./components/TestForm/TestForm";
import AddQuestion from "./components/AddQuestion/AddQuestion";
import { useNavigate, useParams } from "react-router-dom";
import { decryptData } from '../../utils/crypto';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const CreateTestAi = () => {
  const { t } = useTranslation();
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
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    try {
      const decryptedGroupId = decryptData(encodedGroupId);
      setGroupId(decryptedGroupId);
    } catch (err) {
      toast.error(t("Tests.CreateTestAi.decryptError"));
    }
  }, [encodedGroupId, t]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrors({});

    if (!formData.isValid) {
      toast.error(t("Tests.CreateTestAi.fixFormErrors"));
      setErrors({ form: t("Tests.CreateTestAi.fixFormErrors") });
      setIsGenerating(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/api/tests/generate-test-by-AI`,
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
      toast.success(
        t("Tests.CreateTestAi.generateSuccess", { count: Object.keys(formattedQuestions).length }),
        { autoClose: 5000 }
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.info(t("Tests.CreateTestAi.abortInfo"));
      } else {
        toast.error(t("Tests.CreateTestAi.generateError"));
        const errorMessage = error.response?.data?.error?.includes('Invalid OpenAI API key')
          ? t("Tests.CreateTestAi.apiAuthError")
          : t("Tests.CreateTestAi.generateFail", { message: error.message || error });
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
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
    setIsSubmitting(true);
    const newErrors = {};

    if (!formData.isValid) {
      newErrors.form = t("Tests.CreateTestAi.fixFormErrors");
    }

    if (Object.keys(questionsData).length === 0) {
      newErrors.questions = t("Tests.CreateTestAi.generateBeforeSubmit");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(t("Tests.CreateTestAi.fixFormErrors"));
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      const testPayload = {
        TestName: formData.subject,
        TestDescription: formData.description,
        TimeLimit: (() => {
          const timeValue = formData.time.trim();
          if (/^\d+$/.test(timeValue)) {
            return parseInt(timeValue);
          } else if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
            const [minutes, seconds] = timeValue.split(':').map(Number);
            return minutes + Math.floor(seconds / 60);
          } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeValue)) {
            const [hours, minutes, seconds] = timeValue.split(':').map(Number);
            return hours * 60 + minutes + Math.floor(seconds / 60);
          }
          return 0;
        })(),
        CreatedDate: new Date().toISOString().split('T')[0],
        DeadlineDate: formData.deadline || null,
        MaxMark: parseInt(formData.maxScore) || 0,
        ImageFilePath: null,
        GroupId: GroupId,
        AttemptsTotal: parseInt(formData.numAttempts) || 1,
        ShowAnswers: formData.showAnswersAfterTest || false,
      };

      console.log("testPayLoad: ", testPayload);

      const testResponse = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/tests`, testPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const testId = testResponse.data.TestId;

      if (!testId) {
        throw new Error(t("Tests.CreateTestAi.testIdError"));
      }

      const questionsPayload = await Promise.all(
        Object.values(questionsData).map(async (question) => {
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
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              fileUrl = imageResponse.data.fileUrl;
            } catch (error) {
              throw new Error(t("Tests.CreateTestAi.imageUploadError", { message: error.message || error }));
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
            `${process.env.REACT_APP_BASE_API_URL}/api/testQuestions`,
            questionData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const testQuestionId = questionResponse.data.TestQuestionId;

          if (!testQuestionId) {
            throw new Error(t("Tests.CreateTestAi.testQuestionIdError"));
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
          <p>{t("Tests.CreateTestAi.testCreated")}</p>
          <p>{t("Tests.CreateTestAi.testName")}: {formData.subject}</p>
        </div>,
        { autoClose: 5000 }
      );

      setTimeout(() => {
        navigate('/teacher/tests');
        navigate(0);
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || t("Tests.CreateTestAi.createError");
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
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
        questionInputDis={false}
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
            {isGenerating ? t("Tests.CreateTestAi.generating") : t("Tests.CreateTestAi.generate")}
          </PrimaryButton>
        ) : (
          <>
            <PrimaryButton
              className="w-96 max-w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("Tests.CreateTestAi.saving") : t("Tests.CreateTestAi.create")}
            </PrimaryButton>
            <PrimaryButton
              className="w-96 max-w-full bg-purple-500 hover:bg-purple-600"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? t("Tests.CreateTestAi.generating") : t("Tests.CreateTestAi.regenerate")}
            </PrimaryButton>
          </>
        )}
      </div>

      <WaitModal isOpen={isGenerating} onClose={handleCancelGeneration} />
    </div>
  );
};

export default CreateTestAi;