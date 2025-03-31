import React, { useState, useCallback, useEffect } from 'react';
import CustomInput from '../CustomInput/CustomInput';
import './AddQuestion.css';

const AddQuestion = ({ taskNumber, onQuestionChange, errors }) => {
  const [options, setOptions] = useState([
    { id: 1, value: '' },
    { id: 2, value: '' },
  ]);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [questionText, setQuestionText] = useState('');

  const handleOptionChange = useCallback((index, newValue) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index].value = newValue;

      if (newValue && index === updatedOptions.length - 1 && updatedOptions.length < 4) {
        return [...updatedOptions, { id: Date.now(), value: '' }];
      }

      if (!newValue && index === updatedOptions.length - 2 && updatedOptions.length > 2) {
        return updatedOptions.slice(0, -1);
      }

      return updatedOptions;
    });
  }, []);

  const removeOption = useCallback((id) => {
    setOptions((prevOptions) => {
      if (prevOptions.length <= 2) return prevOptions;

      const updatedOptions = prevOptions.filter((option) => option.id !== id);

      if (selectedOption === id.toString()) {
        setSelectedOption('');
      }

      return updatedOptions;
    });
  }, [selectedOption]);

  const handleQuestionImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      setQuestionImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Будь ласка, виберіть файл зображення (JPEG, PNG тощо).');
    }
  }, []);

  const handleRadioChange = useCallback((id) => {
    setSelectedOption(id.toString());
  }, []);

  useEffect(() => {
    const questionData = {
      taskNumber,
      questionText,
      options: options.map((opt) => opt.value),
      correctAnswer: selectedOption,
      questionImage,
    };
    onQuestionChange(taskNumber, questionData);
  }, [taskNumber, questionText, options, selectedOption, questionImage, onQuestionChange]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('data:')) {
        setPreviewImage(null);
      }
    };
  }, [previewImage]);

  return (
    <div className="p-5 border rounded-lg bg-white shadow-md space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-gray-700">{taskNumber}.</span>
        <div className="flex-1">
          <CustomInput
            placeholder="Введіть завдання"
            className="flex-1"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          {errors?.questionText && (
            <p className="text-red-500 text-sm mt-1">{errors.questionText}</p>
          )}
        </div>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleQuestionImageUpload}
          className="hidden"
          id={`question-image-upload-${taskNumber}`}
        />
        <label
          htmlFor={`question-image-upload-${taskNumber}`}
          className="flex items-center gap-2 text-purple-500 font-bold cursor-pointer hover:text-purple-600"
        >
          <svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M31.2498 16.6667H31.2706M26.0414 43.75H12.4998C10.8422 43.75 9.25244 43.0915 8.08034 41.9194C6.90824 40.7473 6.24976 39.1576 6.24976 37.5V12.5C6.24976 10.8424 6.90824 9.25269 8.08034 8.08058C9.25244 6.90848 10.8422 6.25 12.4998 6.25H37.4998C39.1574 6.25 40.7471 6.90848 41.9192 8.08058C43.0913 9.25269 43.7498 10.8424 43.7498 12.5V26.0417"
              stroke="#8A48E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.24976 33.3333L16.6664 22.9167C18.5998 21.0563 20.9831 21.0563 22.9164 22.9167L31.2498 31.25"
              stroke="#8A48E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29.1664 29.1667L31.2498 27.0834C32.6456 25.7417 34.2706 25.3667 35.7956 25.9584M33.3331 39.5834H45.8331M39.5831 33.3334V45.8334"
              stroke="#8A48E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Додати зображення</span>
        </label>
      </div>

      {previewImage ? (
        <div className="mt-2">
          <img
            src={previewImage}
            alt="Попередній перегляд питання"
            className="max-w-full h-auto max-h-40 object-contain rounded-md border border-gray-200"
          />
          <button
            onClick={() => {
              setPreviewImage(null);
              setQuestionImage(null);
            }}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Видалити зображення
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Зображення не вибрано.</p>
      )}

      <p className="text-sm text-gray-500">
        Введіть {options.length} відповіді вибору і позначте вірну відповідь.
      </p>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-3 py-1">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value={option.id}
                checked={selectedOption === option.id.toString()}
                onChange={() => handleRadioChange(option.id)}
                className="w-5 h-5 text-purple-500 border-gray-300 focus:ring-purple-500 accent-purple-500 relative top-[12px]"
              />
              {errors?.correctAnswer && selectedOption !== option.id.toString() && (
                <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>
              )}
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1">
                <CustomInput
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder="Введіть відповідь"
                  className="w-full"
                />
                {errors?.options && errors.options[index] && (
                  <p className="text-red-500 text-sm mt-1">{errors.options[index]}</p>
                )}
              </div>
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(option.id)}
                  className="text-red-500 hover:text-red-700 relative top-[12px]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddQuestion;