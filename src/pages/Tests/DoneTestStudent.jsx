import { useParams, useNavigate } from 'react-router-dom';
import { encryptData, decryptData } from '../../utils/crypto';
import { useEffect, useState } from 'react';
import './DoneTestStudent.css';
import { PrimaryButton, SecondaryButton } from './components/Buttons/Buttons2';
import axios from 'axios';

const DoneTestStudent = () => {
    const navigate = useNavigate();
    const { encryptedTestId } = useParams();
    const [testData, setTestData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const decryptedTestId = decryptData(encryptedTestId);
                const response = await axios.get(`http://localhost:4000/api/doneTests/complete/${decryptedTestId}`);
                setTestData(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchTestData();
    }, [encryptedTestId]);

    if (error) {
        return <div>Помилка: {error}</div>;
    }

    if (!testData) {
        return <div>Завантаження...</div>;
    }

    console.log(testData);
    
    const percentage = (testData.Mark / testData.MaxMark) * 100;

    const getBorderColor = (percentage) => {
        if (percentage > 80) return '#0EBE6A';
        if (percentage > 60) return '#F6C23E';
        return '#E74A3B';
    };


    const runTestHandler = async () => {
        try {
            const data = {
                Mark: 0,
                DoneDate: new Date().toISOString(),
                SpentTime: "00:00:00",
                StudentId: testData.StudentId,
                TestId: testData.TestId
            };

            const response = await axios.post('http://localhost:4000/api/doneTests', data);

            const doneTestId = response.data.DoneTestId;

            const encryptedTestId = encryptData(doneTestId);

            navigate(`/test/${encryptedTestId}`);
        } catch (error) {
            console.error('Помилка при створенні тесту:', error);
        }
    };

    return (
        <div className="done-test-page mx-auto w-full max-w-[900px] px-4">
            <div className='main-container'>
                <h1 className="header-text">Тест | {testData.SubjectName}</h1>

                <div className="flex justify-between items-center mb-4">
                    <div className='flex gap-3 mt-3'>
                        <span className='theme-text1'>Тема: </span>
                        <span className='theme-text2'>{testData.TestName}</span>
                    </div>
                    <div className="score-container" style={{ border: `${getBorderColor(percentage)} solid 1px` }}>
                        <div>
                            <div className="text-xs text-[#827ead] font-normal font-[Mulish]">Бал</div>
                            <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">{testData.Mark}</div>
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
                                    stroke={getBorderColor(percentage)}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <hr className="border-[#f6eeff] mb-4" />

                <div className="flex justify-between gap-5 mb-6">
                    <p className="result-text mt-1">Результат:</p>
                    <div className='w-full flex flex-col'>
                        <span className="percent-text">{percentage.toFixed(0)}%</span>
                        <div className="w-full h-4 bg-gray-200 rounded-[20px] overflow-hidden">
                            <div className="h-full bg-[#8a48e6] rounded-[20px]" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="input-container border-[#8a48e6]">
                        <div>
                            <div className="text-xs text-[#827ead] font-normal font-[Mulish]">Кількість питань</div>
                            <div className="text-[15px] text-[#8a48e6] font-bold font-[Nunito]">{testData.QuestionsAmount}</div>
                        </div>
                        <div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#8A48E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="input-container">
                        <div>
                            <div className="text-xs text-[#827ead] font-normal font-[Mulish]">Правильні відповіді</div>
                            <div className="text-[15px] text-[#8a48e6] font-bold font-[Nunito]">{testData.CorrectAnswersAmount}</div>
                        </div>
                        <div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#8A48E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="input-container">
                        <div>
                            <div className="text-xs text-[#827ead] font-normal font-[Mulish]">Неправильні відповіді</div>
                            <div className="text-[15px] text-[#8a48e6] font-bold font-[Nunito]">{testData.QuestionsAmount - testData.CorrectAnswersAmount}</div>
                        </div>
                        <div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#8A48E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="input-container border-[#8a48e6]">
                        <div>
                            <div className="text-xs text-[#827fae] font-normal font-[Mulish]">Часу витрачено</div>
                            <div className="text-[15px] text-[#8a48e6] font-bold font-[Nunito]">{testData.SpentTime}</div>
                        </div>
                        <div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#8A48E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <p className="attempts-text">
                    Витрачено спроб: {testData.AttemptsUsed}/{testData.AttemptsTotal}
                </p>
                <div className="flex space-x-4 mb-3">
                    <SecondaryButton disabled={testData.AttemptsUsed >= testData.AttemptsTotal} onClick={() => {testData.AttemptsUsed < testData.AttemptsTotal && runTestHandler()}}>Наступна спроба</SecondaryButton>
                    <PrimaryButton onClick={() => { navigate("/student/tests") }}>Повернуться на тести</PrimaryButton>
                </div>
            </div>

            {(testData.ShowAnswers)&&
            
            testData.Questions.map((question, qIndex) => (
                <div key={qIndex} className="question-container">
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="question-text">{qIndex + 1}.</span>
                        <p className="question-text">{question.TestQuestionHeader}</p>
                    </div>
                    <div>
                        {question.Answers.map((ans, ansIndex) => {
                            let borderColor = 'border-gray-300';
                            let labelText = '';
                            let labelColor = 'text-gray-500';

                            if (ans.isSelectedAnswer && ans.isRightAnswer) {
                                borderColor = 'border-green-600';
                                labelText = 'Ваша відповідь';
                                labelColor = 'text-green-600';
                            } else if (ans.isSelectedAnswer && !ans.isRightAnswer) {
                                borderColor = 'border-red-600';
                                labelText = 'Ваша відповідь';
                                labelColor = 'text-red-600';
                            } else if (!ans.isSelectedAnswer && ans.isRightAnswer) {
                                borderColor = 'border-green-600';
                                labelText = 'Правильна відповідь';
                                labelColor = 'text-green-600';
                            }

                            return (
                                <div
                                    key={ansIndex}
                                    className={`answer-container ${borderColor}`}
                                >
                                    <span className="answer-text">{ans.AnswerText}</span>
                                    {labelText && (
                                        <span className={`text-xs font-[Mulish] ${labelColor}`}>
                                            {labelText}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <br />
        </div>
    );
};

export default DoneTestStudent;