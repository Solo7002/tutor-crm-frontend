import React, { useEffect, useState, useMemo } from 'react';
import Toggle from '../Toggle/Toggle';
import CustomInput from '../CustomInput/CustomInput';

const TestForm = ({ defaultNumQuestions = '2', onFormChange, errors: externalErrors }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState(defaultNumQuestions);
  const [numAttempts, setNumAttempts] = useState('1');
  const [time, setTime] = useState('00:10:00');
  const [maxScore, setMaxScore] = useState('12');
  const [deadline, setDeadline] = useState('');
  const [showAnswersAfterTest, setShowAnswersAfterTest] = useState(false);
  const [showCorrectAnswersDuringTest, setShowCorrectAnswersDuringTest] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Individual validation functions
  const validateSubject = (value) => {
    return !value || value.trim() === '' ? 'Тема тесту не може бути порожньою.' : '';
  };

  const validateDescription = (value) => {
    return !value || value.trim() === '' ? 'Опис тесту не може бути порожнім.' : '';
  };

  const validateNumQuestions = (value) => {
    const effectiveValue = value || defaultNumQuestions;
    const num = parseInt(effectiveValue, 10);
    return isNaN(num) || num < 1 ? 'Кількість питань має бути числом >= 1.' : '';
  };

  const validateNumAttempts = (value) => {
    const effectiveValue = value || '1';
    const num = parseInt(effectiveValue, 10);
    return isNaN(num) || num < 1 ? 'Кількість спроб має бути числом >= 1.' : '';
  };

  const validateTime = (value) => {
    const effectiveValue = value || '00:10:00';
    if (!effectiveValue || effectiveValue.trim() === '') {
      return 'Час виконання не може бути порожнім.';
    }
    const timeValue = effectiveValue.trim();
    let timeInMinutes = 0;
    if (/^\d+$/.test(timeValue)) {
      timeInMinutes = parseInt(timeValue);
    } else if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
      const [minutes, seconds] = timeValue.split(':').map(Number);
      timeInMinutes = minutes + Math.floor(seconds / 60);
    } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeValue)) {
      const [hours, minutes, seconds] = timeValue.split(':').map(Number);
      timeInMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
    } else {
      return 'Некоректний формат часу. Використовуйте число (хвилини), MM:SS або HH:MM:SS.';
    }
    return timeInMinutes < 0 ? 'Час виконання не може бути від’ємним.' : '';
  };

  const validateMaxScore = (value) => {
    const effectiveValue = value || '12';
    const num = parseInt(effectiveValue, 10);
    return isNaN(num) || num < 0 ? 'Максимальний бал має бути числом >= 0.' : '';
  };

  const validateDeadline = (value) => {
    if (!value) {
      return 'Будь ласка, виберіть дедлайн.';
    }
    const deadlineDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today ? 'Дедлайн не може бути меншим за сьогоднішню дату.' : '';
  };

  // Handle blur for each field
  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let error = '';
    let newValue = value;
    
    // Set default value and validate
    switch (field) {
      case 'subject':
        error = validateSubject(value);
        break;
      case 'description':
        error = validateDescription(value);
        break;
      case 'numQuestions':
        if (!value || value.trim() === '') {
          newValue = defaultNumQuestions;
          setNumQuestions(newValue);
        }
        error = validateNumQuestions(newValue);
        break;
      case 'numAttempts':
        if (!value || value.trim() === '') {
          newValue = '1';
          setNumAttempts(newValue);
        }
        error = validateNumAttempts(newValue);
        break;
      case 'time':
        if (!value || value.trim() === '') {
          newValue = '00:10:00';
          setTime(newValue);
        }
        error = validateTime(newValue);
        break;
      case 'maxScore':
        if (!value || value.trim() === '') {
          newValue = '12';
          setMaxScore(newValue);
        }
        error = validateMaxScore(newValue);
        break;
      case 'deadline':
        error = validateDeadline(value);
        break;
      default:
        break;
    }
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Check overall form validity
  const isFormValid = () => {
    const errors = {
      subject: validateSubject(subject),
      description: validateDescription(description),
      numQuestions: validateNumQuestions(numQuestions),
      numAttempts: validateNumAttempts(numAttempts),
      time: validateTime(time),
      maxScore: validateMaxScore(maxScore),
      deadline: validateDeadline(deadline),
    };
    return Object.values(errors).every((error) => error === '');
  };

  const formData = useMemo(() => ({
    subject,
    numAttempts,
    time,
    maxScore,
    deadline,
    showAnswersAfterTest,
    showCorrectAnswersDuringTest,
    numQuestions,
    description,
    isValid: isFormValid(),
  }), [
    subject,
    numAttempts,
    time,
    maxScore,
    deadline,
    showAnswersAfterTest,
    showCorrectAnswersDuringTest,
    numQuestions,
    description,
  ]);

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const handleNumQuestionsChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setNumQuestions('');
    } else {
      let num = parseInt(value, 10);
      if (isNaN(num) || num < 1) {
        setNumQuestions('1');
      } else if (num > 20) {
        setNumQuestions('20');
      } else {
        setNumQuestions(num.toString());
      }
    }
  };

  const starIcon = (
    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 16.75L4.82799 19.995L6.00699 13.122L1.00699 8.25495L7.90699 7.25495L10.993 1.00195L14.079 7.25495L20.979 8.25495L15.979 13.122L17.158 19.995L11 16.75Z"
        stroke="#8A48E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );

  const checkIcon = (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 6L6.5 11L16.5 1"
        stroke="#8A48E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );

  const clockIcon = (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 12L10.5 10V5M1.5 10C1.5 11.1819 1.73279 12.3522 2.18508 13.4442C2.63738 14.5361 3.30031 15.5282 4.13604 16.364C4.97177 17.1997 5.96392 17.8626 7.05585 18.3149C8.14778 18.7672 9.3181 19 10.5 19C11.6819 19 12.8522 18.7672 13.9442 18.3149C15.0361 17.8626 16.0282 17.1997 16.864 16.364C17.6997 15.5282 18.3626 14.5361 18.8149 13.4442C19.2672 12.3522 19.5 11.1819 19.5 10C19.5 8.8181 19.2672 7.64778 18.8149 6.55585C18.3626 5.46392 17.6997 4.47177 16.864 3.63604C16.0282 2.80031 15.0361 2.13738 13.9442 1.68508C12.8522 1.23279 11.6819 1 10.5 1C9.3181 1 8.14778 1.23279 7.05585 1.68508C5.96392 2.13738 4.97177 2.80031 4.13604 3.63604C3.30031 4.47177 2.63738 5.46392 2.18508 6.55585C1.73279 7.64778 1.5 8.8181 1.5 10Z"
        stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );

  const questionIcon = (
    <span className="text-purple-500 text-lg">?</span>
  );

  return (
    <div className="w-full mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-sm">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            <CustomInput
              label="Тема:"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={() => handleBlur('subject', subject)}
              placeholder="Ввести текст тут"
            />
            {touched.subject && (formErrors.subject || externalErrors?.subject) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.subject || externalErrors.subject}</p>
            )}
          </div>
          <div className="w-full sm:w-1/2">
            <CustomInput
              label="Максимальний бал"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              onBlur={() => handleBlur('maxScore', maxScore)}
              placeholder="12"
              icon={starIcon}
            />
            {touched.maxScore && (formErrors.maxScore || externalErrors?.maxScore) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.maxScore || externalErrors.maxScore}</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <CustomInput
            label="Опис:"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description', description)}
            placeholder="Ввести текст тут"
          />
          {touched.description && (formErrors.description || externalErrors?.description) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.description || externalErrors.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <CustomInput
              label="Кількість питань"
              type="number"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              onBlur={() => handleBlur('numQuestions', numQuestions)}
              placeholder={defaultNumQuestions}
              min="1"
              max="20"
              icon={questionIcon}
            />
            {touched.numQuestions && (formErrors.numQuestions || externalErrors?.numQuestions) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.numQuestions || externalErrors.numQuestions}</p>
            )}
          </div>
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <CustomInput
              label="Кількість спроб"
              type="number"
              value={numAttempts}
              onChange={(e) => setNumAttempts(e.target.value)}
              onBlur={() => handleBlur('numAttempts', numAttempts)}
              placeholder="1"
              icon={checkIcon}
            />
            {touched.numAttempts && (formErrors.numAttempts || externalErrors?.numAttempts) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.numAttempts || externalErrors.numAttempts}</p>
            )}
          </div>
          <div className="w-full sm:w-1/3">
            <CustomInput
              label="Час на виконання"
              value={time}
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d:]/g, '');
                if (value.length <= 8) {
                  setTime(value);
                }
              }}
              onKeyUp={(e) => {
                let value = e.target.value;
                if (value.length === 2 || value.length === 5) {
                  setTime(value + ':');
                }
              }}
              onBlur={() => handleBlur('time', time)}
              placeholder="00:10:00"
              maxLength="8"
              inputMode="numeric"
              icon={clockIcon}
            />
            {touched.time && (formErrors.time || externalErrors?.time) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.time || externalErrors.time}</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <CustomInput
            label="Дедлайн"
            type="date"
            value={deadline ? deadline.split('T')[0] : ''}
            onChange={(e) => setDeadline(e.target.value)}
            onBlur={() => handleBlur('deadline', deadline)}
            min={formatDateForInput(new Date())}
          />
          {touched.deadline && (formErrors.deadline || externalErrors?.deadline) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.deadline || externalErrors.deadline}</p>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4 mt-2">
          <Toggle
            checked={showAnswersAfterTest}
            onChange={() => setShowAnswersAfterTest(!showAnswersAfterTest)}
            label="Показати учню всі запитання після тестування."
          />
          <Toggle
            checked={showCorrectAnswersDuringTest}
            onChange={() => setShowCorrectAnswersDuringTest(!showCorrectAnswersDuringTest)}
            label="Показати учню правильні відповіді після тестування."
          />
        </div>
      </div>
    </div>
  );
};

export default TestForm;