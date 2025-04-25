import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../Buttons/Buttons2';
import { encryptData } from '../../../../utils/crypto';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Add this import

const TestModal = ({ isOpened, onClose, test, studentId }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(isOpened);
  const { t } = useTranslation(); // Add translation hook

  useEffect(() => {
    setIsOpen(isOpened);
  }, [isOpened]);
  if (!isOpen) return null;

  const getTestType = () => {
    if (!test.isDone) {
      const currentDate = new Date();
      const deadlineDate = new Date(test.Deadline);
      return currentDate > deadlineDate ? 'overdue' : 'default';
    } else {
      const percentage = (test.Mark / test.MaxMark) * 100;
      if (percentage >= 85) return 'done_good';
      if (percentage >= 39) return 'done_medium';
      return 'done_bad';
    }
  };

  const getBorderColor = () => {
    switch (getTestType()) {
      case 'default': return '#e0e0e0'; // Not done, not overdue
      case 'overdue': return '#e64851'; // Overdue (red)
      case 'done_good': return '#47c974'; // 75%+ (green)
      case 'done_medium': return '#ffa869'; // 39-74% (yellow/orange)
      case 'done_bad': return '#e64851'; // <39% (red)
      default: return '#e0e0e0';
    }
  };

  const getDateColor = () => {
    switch (getTestType()) {
      case 'default': return '#8a48e6';
      case 'overdue': return '#e64851';
      case 'done_good': return '#47c974';
      case 'done_medium': return '#47c974';
      case 'done_bad': return '#47c974';
      default: return '#8a48e6';
    }
  };

  const getButtonText = () => {
    if (test.AttemptsUsed == 0) {
      return t("Tests.TestStudentComponents.TestModal.startButton");
    } else if (test.AttemptsUsed > 0) {
      return t("Tests.TestStudentComponents.TestModal.retryButton");
    }
  };

  const getButtonVisibility = () => {
    if (test.AttemptsUsed >= test.Attempts) {
      return "none";
    }
    return "block";
  }

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const resultClickHandler = () => {
    const doneTestId = test.DoneTestId;
    const encryptedTestId = encryptData(doneTestId);

    navigate(`/student/tests/complete/${encryptedTestId}`);
  }

  const runTestHandler = async () => {
    try {
      const data = {
        Mark: 0,
        DoneDate: new Date().toISOString(),
        SpentTime: "00:00:00",
        StudentId: studentId,
        TestId: test.TestId
      };

      const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/doneTests`, data, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
      });

      const doneTestId = response.data.DoneTestId;

      const encryptedTestId = encryptData(doneTestId);

      navigate(`/test/${encryptedTestId}`);
    } catch (error) {
      toast.error(t("Tests.TestStudentComponents.TestModal.createTestError"));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-[20px] shadow-lg w-[460px]">
          <div className="p-5 h-full flex flex-col">
            {/* Header */}
            <div className="relative mb-4 h-10">
              {/* Іконка зліва */}

              {/* Заголовок по центру */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute left-0 top-0 cursor-pointer"
                  onClick={handleClose}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="40" height="40" rx="20" fill="white" />
                    <path
                      d="M13 20H27M13 20L19 26M13 20L19 14"
                      stroke="#120C38"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="text-[#120C38] text-[15px] font-bold font-[Nunito]">
                  {test.TestName}
                </h2>
              </div>
            </div>

            {/* Блок з інформаційними полями */}
            <div className="space-y-4">
              {/* 1 ряд: Видано */}
              <div className="flex justify-between">
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 h-[54px]" style={{ width: test.isDone ? "200px" : "100%" }}>
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      {t("Tests.TestStudentComponents.TestModal.issued")}
                    </div>
                    <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                      {formatDate(test.CreatedDate)}
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {test.isDone && (<div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]" style={{ border: `${getBorderColor()} solid 1px` }}>
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      {t("Tests.TestStudentComponents.TestModal.score")}
                    </div>
                    <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                      {test.Mark}
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75L5.828 20.995L7.007 14.122L2.007 9.255L8.907 8.255L11.993 2.002L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                        stroke={getBorderColor()}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>)}
              </div>

              {/* 2 ряд: Виконати до і Виконано */}
              <div className="flex gap-5">
                {/* Виконати до */}
                <div className="flex justify-between items-center border border-[#8a48e6] rounded-2xl p-2.5 w-[200px] h-[54px]" style={{ border: `${!test.isDone && getDateColor()} solid 1px` }}>
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      {t("Tests.TestStudentComponents.TestModal.completeBy")}
                    </div>
                    <div className="text-[15px] text-[#8a48e6] font-bold font-[Nunito]" style={{ color: !test.isDone && getDateColor() }}>
                      {formatDate(test.Deadline)}
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                        stroke={!test.isDone && getDateColor()}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Виконано */}
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]" style={{ border: `${test.isDone ? getDateColor() : "#d7d7d7"} solid 1px` }}>
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      {t("Tests.TestStudentComponents.TestModal.completed")}
                    </div>
                    <div className="text-[15px] text-[#827ead] font-bold font-[Nunito]" style={{ color: test.isDone ? getDateColor() : "#827ead" }}>
                      {test.isDone ? formatDate(test.DoneDate) : '-- -- ----'}
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 3 ряд: Максимальний бал і Статус */}
              <div className="flex gap-5">
                {/* Максимальний бал */}
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]">
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      {t("Tests.TestStudentComponents.TestModal.maxScore")}
                    </div>
                    <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                      {test.MaxMark}
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75L5.828 20.995L7.007 14.122L2.007 9.255L8.907 8.255L11.993 2.002L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Статус */}
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]">
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      {t("Tests.TestStudentComponents.TestModal.status")}
                    </div>
                    <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                      {test.isDone ? t("Tests.TestStudentComponents.TestModal.statusDone") : t("Tests.TestStudentComponents.TestModal.statusToDo")}
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Нижня інформаційна панель */}
            <div className="mt-4 space-y-2 px-2">
              <div className="flex justify-between">
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    {t("Tests.TestStudentComponents.TestModal.attemptsCount")}:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    {test.Attempts}
                  </span>
                </div>
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    {t("Tests.TestStudentComponents.TestModal.attemptsUsed")}:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    {test.AttemptsUsed}/{test.Attempts}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    {t("Tests.TestStudentComponents.TestModal.timeToComplete")}:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    {test.TimeLimit}{t("Tests.TestStudentComponents.TestModal.minutesShort")}
                  </span>
                </div>
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    {t("Tests.TestStudentComponents.TestModal.questionsCount")}:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    {test.AmountOfQuestions}
                  </span>
                </div>
              </div>
            </div>
            <div className='mt-4' style={{ display: test.isDone ? "block" : "none" }}>
              <SecondaryButton onClick={resultClickHandler}>{t("Tests.TestStudentComponents.TestModal.resultButton")}</SecondaryButton>
            </div>
            <div className='mt-3' style={{ display: getButtonVisibility() }}>
              <PrimaryButton onClick={runTestHandler}>{getButtonText()}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestModal;