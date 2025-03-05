import React, { useState } from 'react';
import '../ProfileTeacher.css';

const CourseList = () => {
    const [expandedCourses, setExpandedCourses] = useState({});

    const courses = [
        { name: 'Математика' },
        { name: 'Фізика' },
    ];

    const courseDetails = [
        { group: '1', type: 'Індивідуальне', format: 'Офлайн', location: 'Вул. Мечнікова 14', price: '500грн' },
        { group: '2', type: 'Індивідуальне', format: 'Онлайн', location: 'Google Meet', price: '500грн' },
        { group: '3', type: 'Групове', format: 'Офлайн', location: 'Вул. Мечнікова 14', price: '300грн' },
        { group: '4', type: 'Групове', format: 'Онлайн', location: 'Google Meet', price: '300грн' },
    ];

    const toggleExpand = (courseName) => {
        setExpandedCourses((prev) => ({
            ...prev,
            [courseName]: !prev[courseName],
        }));
    };

    return (
        <div className="w-full col-span-3 bg-white rounded-[20px] flex flex-col items-center transition-all duration-300 min-h-[268px]">
            <h2 className="text-[#120c38] text-2xl font-bold font-['Nunito'] my-5">Курси</h2>

            <div className="w-[90%] flex flex-col gap-4">
                {courses.map((course, index) => (
                    <div key={index} className="w-full">
                        <button
                            className={`w-full h-10 flex items-center justify-between px-5 rounded-[30px] border border-[#8a48e6] cursor-pointer transition-colors ${expandedCourses[course.name] ? 'bg-[#8a48e6] text-white' : 'bg-white text-[#8a48e6]'}`}
                            onClick={() => toggleExpand(course.name)}
                        >
                            <span className="text-[15px] font-bold font-['Nunito']">{course.name}</span>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 14.5V15M12 15L18 9M12 15L6 9"
                                    stroke={expandedCourses[course.name] ? 'white' : '#8A48E6'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        

                        {expandedCourses[course.name] && (
                            <div className="w-full mt-4">
                                <div className="ctable grid grid-cols-5 gap-2 text-[#8a48e6] text-[15px] font-bold font-['Nunito']">
                                    <div>№ групи</div>
                                    <div>Вид</div>
                                    <div className='format'>Формат</div>
                                    <div>Місце проведення</div>
                                    <div>Ціна</div>
                                </div>
                                <div className="mt-2 space-y-2">
                                    {courseDetails.map((detail, idx) => (
                                        <div key={idx} className="ctable grid grid-cols-5 gap-2 text-[#827ead] text-[15px] font-normal font-['Mulish']">
                                            <div>{detail.group}</div>
                                            <div>{detail.type}</div>
                                            <div className='format'>{detail.format}</div>
                                            <div>{detail.location}</div>
                                            <div>{detail.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {index !== courses.length - 1 && <hr className="border-t border-[#f5eeff] mt-4" />}
                    </div>
                ))}
            </div>

            <button
                className="w-full max-w-[418px] h-12 m-5 bg-[#8a4ae6] rounded-2xl text-white text-xl font-medium font-['Nunito'] flex items-center justify-center"
                onClick={() => alert('Редагування курсів!')}
            >
                Редагувати курси
            </button>
        </div>
    );
};

export default CourseList;