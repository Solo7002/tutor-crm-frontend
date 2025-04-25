import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StandartInput from "../StandartInput/StandartInput";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EvaluateAIModal = ({ isOpened, onClose, onNext, hometask = null, doneHometask = null, subject = "", setRefreshTrigger }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [waitingText, setWaitingText] = useState(t("HomeTaskTeacher.components.EvaluateAIModal.PleaseWaitAIChecking"));
  const [aiAnswerDescription, setAiAnswerDescription] = useState("");
  const [aiMark, setAiMark] = useState("?");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (isLoading) {
      setAiMark("?");
      const interval = setInterval(() => {
        setWaitingText(prev => {
          if (prev.endsWith("....")) {
            return t("HomeTaskTeacher.components.EvaluateAIModal.PleaseWaitAIChecking");
          } else if (prev.endsWith("...")) {
            return prev + ".";
          } else if (prev.endsWith("..")) {
            return prev + ".";
          } else if (prev.endsWith(".")) {
            return prev + ".";
          } else {
            return prev + ".";
          }
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading, t]);

  const checkWithAIHandler = async () => {
    setIsLoading(true);

    const data = {
      subject: subject,
      maxGrade: hometask.MaxMark,
      taskDescription: hometask.HomeTaskDescription,
      taskHeader: hometask.HometaskHeader,
      teacherFiles: hometask.HometaskFiles.map(file => file.Filepath),
      studentFiles: doneHometask.DoneHometaskFiles.map(file => file.Filepath),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/homeTasks/check-homework`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setAiAnswerDescription(response.data.Comment);
      setAiMark(response.data.Mark);
    } catch (error) {
      toast.error(
        <div>
          <p>{t('HomeTaskTeacher.components.page.GeneralError')}</p>
        </div>,
        { autoClose: 5000, position: "bottom-right" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateAI = async () => {
    if (aiMark === "?") {
      toast.error(
        <div>
          <p>{t('HomeTaskTeacher.components.EvaluateAIModal.WaitForAICompletion')}</p>
        </div>,
        { autoClose: 5000, position: "bottom-right" }
      );
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/doneHometasks/${doneHometask.DoneHometaskId}`, {
        Mark: parseInt(aiMark)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onClose();
      setRefreshTrigger();
      toast.success(
        t('HomeTaskTeacher.components.EvaluateAIModal.TaskSuccessfullyEvaluated', { aiMark, maxMark: hometask.MaxMark }),
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      toast.error(
        <div>
          <p>{t('HomeTaskTeacher.components.EvaluateAIModal.ErrorUpdatingGrade')}</p>
        </div>,
        { autoClose: 5000, position: "bottom-right" }
      );
      toast.error(
        <div>
          <p>{t('HomeTaskTeacher.components.EvaluateAIModal.ErrorOccurred')}</p>
        </div>,
        { autoClose: 3000, position: "bottom-right", hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true }
      );
    }
  };

  if (!isOpened) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <style>
        {`
        input[type="date"]::-webkit-calendar-picker-indicator {
          display: none;
        }
        input[type="date"] {
          -webkit-appearance: none;
          -moz-appearance: textfield;
          appearance: none;
        }
      `}
      </style>
      <div
        className="
          w-full
          max-w-[600px]
          bg-white
          rounded-3xl
          outline outline-1 outline-[#8a48e6]
          flex flex-col
          px-2
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center" onClick={() => {onClose(); setAiAnswerDescription(""); setAiMark("?")}}>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 7H15M1 7L7 13M1 7L7 1" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <h2 className="flex-1 text-center text-[#120c38] text-[15px] font-bold font-['Nunito'] mt-1">
            {t('HomeTaskTeacher.components.EvaluateAIModal.AIEvaluation')}
          </h2>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"></div>
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <div className="h-10 px-4 py-2.5 bg-white hover:bg-black text-[#120c38] hover:text-white stroke-black hover:stroke-white cursor-pointer rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#120c38] inline-flex justify-end items-center gap-2.5" onClick={() => {onNext(); setAiAnswerDescription(""); setAiMark("?");}}>
            <div className="justify-center text-[15px] font-bold font-['Nunito']">{t('HomeTaskTeacher.components.EvaluateAIModal.EvaluateManually')}</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12L4.69799 4.034C4.605 3.99783 4.50331 3.99031 4.40601 4.01241C4.30871 4.03451 4.22024 4.08521 4.15199 4.158C4.08199 4.23267 4.0338 4.3251 4.01264 4.42524C3.99149 4.52538 3.99818 4.6294 4.03199 4.726L6.49999 12M21 12L4.69799 19.966C4.605 20.0022 4.50331 20.0097 4.40601 19.9876C4.30871 19.9655 4.22024 19.9148 4.15199 19.842C4.08199 19.7673 4.0338 19.6749 4.01264 19.5748C3.99149 19.4746 3.99818 19.3706 4.03199 19.274L6.49999 12M21 12H6.49999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div className="h-10 px-4 py-2.5 bg-white hover:bg-[#8a48e6] text-[#8a48e6] hover:text-white stroke-[#8A48E6] hover:stroke-white cursor-pointer rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#8a48e6] inline-flex justify-end items-center gap-2.5" onClick={checkWithAIHandler}>
            <div className="justify-center text-[15px] font-bold font-['Nunito']">{t('HomeTaskTeacher.components.EvaluateAIModal.StartCheck')}</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12L4.69799 4.034C4.605 3.99783 4.50331 3.99031 4.40601 4.01241C4.30871 4.03451 4.22024 4.08521 4.15199 4.158C4.08199 4.23267 4.0338 4.3251 4.01264 4.42524C3.99149 4.52538 3.99818 4.6294 4.03199 4.726L6.49999 12M21 12L4.69799 19.966C4.605 20.0022 4.50331 20.0097 4.40601 19.9876C4.30871 19.9655 4.22024 19.9148 4.15199 19.842C4.08199 19.7673 4.0338 19.6749 4.01264 19.5748C3.99149 19.4746 3.99818 19.3706 4.03199 19.274L6.49999 12M21 12H6.49999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <div className="w-[536px] h-0 outline outline-1 outline-offset-[-0.50px] outline-[#827ead] mx-auto my-3" />

        <div className='px-4 py-2'>
          <div className="justify-center text-[#8a48e6] text-2xl font-bold font-['Nunito']">{t('HomeTaskTeacher.components.EvaluateAIModal.Response')}</div>

          <div className='w-full h-[200px] rounded-3xl border border-[#D7D7D7] py-4 px-4 mt-2'>
            {isLoading
              ? waitingText
              : aiAnswerDescription}
          </div>
        </div>

        <div className='flex justify-between px-4 py-2 mb-2'>
          <div className="w-[69px] h-12 text-center justify-center text-[#8a48e6] text-2xl font-bold font-['Nunito']">{aiMark}/{hometask.MaxMark}</div>
          <div className="h-10 px-4 py-2.5 bg-[#8a48e6] hover:bg-purple-700 text-white stroke-white cursor-pointer rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#8a48e6] inline-flex justify-end items-center gap-2.5" style={{display: (aiMark==="?" && "none")}} onClick={handleEvaluateAI}>
            <div className="justify-center text-[15px] font-bold font-['Nunito']">{t('HomeTaskTeacher.components.EvaluateAIModal.Evaluate')}</div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.66602 15.9997L13.3327 22.6663L26.666 9.33301" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluateAIModal;