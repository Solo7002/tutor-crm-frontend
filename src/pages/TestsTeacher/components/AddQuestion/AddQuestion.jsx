import React, { useState, useCallback } from 'react';
import CustomInput from '../CustomInput/CustomInput';

const TaskInputSection = ({ taskNumber }) => {
    const [options, setOptions] = useState([
        { id: 1, value: '' },
        { id: 2, value: '' },
    ]);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionImage, setQuestionImage] = useState(null);

    const handleOptionChange = useCallback((index, newValue) => {
        setOptions((prevOptions) => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index].value = newValue;

            // Логика добавления/удаления опций
            if (newValue && index === updatedOptions.length - 1 && updatedOptions.length < 4) {
                return [...updatedOptions, { id: Date.now(), value: '' }]; // Используем timestamp для уникального id
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
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setQuestionImage(imageUrl);
            // Очистка памяти при смене изображения
            return () => URL.revokeObjectURL(imageUrl);
        }
    }, []);

    const handleRadioChange = useCallback((id) => {
        setSelectedOption(id.toString());
    }, []);

    return (
        <div className="p-4 border rounded-xl bg-white shadow-sm">
            <div className="space-y-2">
                <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-700 font-['Mulish'] mr-2">
                        {taskNumber}.
                    </span>
                    <h3 className="text-lg font-medium text-gray-700 font-['Mulish']">
                             <CustomInput
                                        
                                placeholder="Введіть завдання"
                                className="flex-1"
                            />
                    </h3>
                </div>
                <div className="flex items-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleQuestionImageUpload}
                        className="hidden"
                        id={`question-image-upload-${taskNumber}`}
                    />
                    <label
                        htmlFor={`question-image-upload-${taskNumber}`}
                        className="flex items-center text-purple-500 font-['Nunito'] font-bold hover:text-purple-600 transition-colors cursor-pointer"
                    >
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M31.2498 16.6667H31.2706M26.0414 43.75H12.4998C10.8422 43.75 9.25244 43.0915 8.08034 41.9194C6.90824 40.7473 6.24976 39.1576 6.24976 37.5V12.5C6.24976 10.8424 6.90824 9.25269 8.08034 8.08058C9.25244 6.90848 10.8422 6.25 12.4998 6.25H37.4998C39.1574 6.25 40.7471 6.90848 41.9192 8.08058C43.0913 9.25269 43.7498 10.8424 43.7498 12.5V26.0417" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.24976 33.3333L16.6664 22.9167C18.5998 21.0563 20.9831 21.0563 22.9164 22.9167L31.2498 31.25" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M29.1664 29.1667L31.2498 27.0834C32.6456 25.7417 34.2706 25.3667 35.7956 25.9584M33.3331 39.5834H45.8331M39.5831 33.3334V45.8334" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <span className="ml-2">Додати зображення</span>
                    </label>
                </div>
            </div>

            {questionImage && (
                <div className="mb-4">
                    <img
                        src={questionImage}
                        alt="Question preview"
                        className="w-32 h-32 object-cover rounded-md"
                        onError={() => setQuestionImage(null)}
                    />
                </div>
            )}

            <p className="text-sm text-gray-500 mb-4 font-['Mulish']">
                Введіть {options.length} відповіді вибору і позначте вірну відповідь.
            </p>

            <div className="flex flex-col gap-4">
                {options.map((option, index) => (
                    <div
                        key={option.id}
                        className="flex items-center gap-3 transition-all duration-300"
                    >
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value={option.id}
                                checked={selectedOption === option.id.toString()}
                                onChange={() => handleRadioChange(option.id)}
                                className="w-5 h-5 text-purple-500 border-gray-300 focus:ring-purple-500"
                            />
                        </label>

                        <div className="flex-1 flex items-center gap-3">
                            <CustomInput
                                label=""
                                value={option.value}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder="Введіть відповідь"
                                className="flex-1"
                            />
                        </div>

                        {options.length > 2 && index < options.length - 1 && (
                            <button
                                onClick={() => removeOption(option.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskInputSection;