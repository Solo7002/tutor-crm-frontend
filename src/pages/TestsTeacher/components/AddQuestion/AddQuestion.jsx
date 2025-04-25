import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CustomInput from '../CustomInput/CustomInput';
import './AddQuestion.css';
import { toast } from 'react-toastify';

const AddQuestion = ({ taskNumber, onQuestionChange, errors, initialData }) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState(() => (
    initialData?.options?.length > 0
      ? initialData.options.map((opt, index) => ({
          id: index + 1,
          value: opt.value || opt,
        }))
      : [
          { id: 1, value: '' },
          { id: 2, value: '' },
        ]
  ));
  const [selectedOption, setSelectedOption] = useState(initialData?.correctAnswer || '');
  const [questionImage, setQuestionImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [questionText, setQuestionText] = useState(initialData?.questionText || '');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (initialData && !isInitialized) {
      setQuestionText(initialData.questionText || '');
      setOptions(
        initialData.options?.length > 0
          ? initialData.options.map((opt, index) => ({
              id: index + 1,
              value: opt.value || opt,
            }))
          : [
              { id: 1, value: '' },
              { id: 2, value: '' },
            ]
      );
      setSelectedOption(initialData.correctAnswer || '');
      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

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
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      toast.info(t('Tests.TestTeacherComponents.AddQuestion.imageFileType'));
    }
  }, [t]);

  const handleRadioChange = useCallback((id) => {
    setSelectedOption(id.toString());
  }, []);

  const questionData = useMemo(() => ({
    taskNumber,
    questionText,
    options: options.map((opt) => opt.value),
    correctAnswer: selectedOption,
    questionImage,
  }), [taskNumber, questionText, options, selectedOption, questionImage]);

  useEffect(() => {
    onQuestionChange(taskNumber, questionData);
  }, [taskNumber, questionData, onQuestionChange]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('data:')) {
        setPreviewImage(null);
      }
    };
  }, [previewImage]);

  return (
    <div className="p-3 sm:p-5 rounded-lg bg-white space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-base sm:text-lg font-bold text-gray-700">{taskNumber}.</span>
        <div className="flex-1">
          <CustomInput
            placeholder={t('Tests.TestTeacherComponents.AddQuestion.enterTask')}
            className="flex-1"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          {errors?.questionText && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.questionText}</p>
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
          {/* SVG icon omitted for brevity */}
          <span className="text-sm sm:text-base">
            {t('Tests.TestTeacherComponents.AddQuestion.addImage')}
          </span>
        </label>
      </div>
  
      {previewImage ? (
        <div className="mt-2">
          <img
            src={previewImage}
            alt={t('Tests.TestTeacherComponents.AddQuestion.questionPreview')}
            className="max-w-full h-auto max-h-32 sm:max-h-40 object-contain rounded-md border border-gray-200"
          />
          <button
            onClick={() => {
              setPreviewImage(null);
              setQuestionImage(null);
            }}
            className="mt-2 text-xs sm:text-sm text-red-500 hover:text-red-700"
          >
            {t('Tests.TestTeacherComponents.AddQuestion.deleteImage')}
          </button>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-gray-500">
          {t('Tests.TestTeacherComponents.AddQuestion.noImageSelected')}
        </p>
      )}
  
      <p className="text-xs sm:text-sm text-gray-500">
        {t('Tests.TestTeacherComponents.AddQuestion.enterOptions', { count: options.length })}
      </p>
  
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-start sm:items-center gap-2 sm:gap-3 py-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="radio"
                value={option.id}
                checked={selectedOption === option.id.toString()}
                onChange={() => handleRadioChange(option.id)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 border-gray-300 focus:ring-purple-500 accent-purple-500 relative top-1 sm:top-[12px]"
              />
              {errors?.correctAnswer && selectedOption !== option.id.toString() && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.correctAnswer}</p>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <div className="flex-1">
                <CustomInput
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={t('Tests.TestTeacherComponents.AddQuestion.enterAnswer')}
                  className="w-full"
                />
                {errors?.options && errors.options[index] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.options[index]}</p>
                )}
              </div>
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(option.id)}
                  className="text-red-500 hover:text-red-700 relative top-1 sm:top-[12px]"
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