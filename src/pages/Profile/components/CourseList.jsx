import React, { useState } from 'react';
import CourseJoinModal from '../../../components/CourseJoin/CourseJoinModal';
import '../ProfileTeacher.css';

const CourseList = ({ courses: initialCourses, userFrom = null, teacher = {}, user = {} }) => {
    const [expandedCourses, setExpandedCourses] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Используем переданные курсы или дефолтные с правильной структурой
    const courses = initialCourses?.length ? initialCourses : [
        { CourseId: -1, CourseName: 'Математика', Groups: [] },
        { CourseId: -2, CourseName: 'Фізика', Groups: [] },
    ];

    const toggleExpand = (courseId) => {
        setExpandedCourses((prev) => ({
            ...prev,
            [courseId]: !prev[courseId],
        }));
    };

    // Компонент для десктопного вида таблицы
    const DesktopTableView = ({ details }) => (
        <div className="hidden md:block w-full mt-4">
            <div className="grid grid-cols-4 gap-2 text-[#8a48e6] text-sm lg:text-[15px] font-bold font-['Nunito']">
                <div>№ групи</div>
                <div>Назва групи</div>
                <div>Кількість учнів</div>
                <div>Ціна</div>
            </div>
            <div className="mt-2 space-y-2">
                {details.map((detail) => (
                    <div key={detail.GroupId} className="grid grid-cols-4 gap-2 text-[#827ead] text-sm lg:text-[15px] font-normal font-['Mulish']">
                        <div>{detail.GroupId}</div>
                        <div>{detail.GroupName}</div>
                        <div>{detail.GroupAmountOfStudents}</div>
                        <div>{detail.GroupPrice}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Компонент для мобильного вида таблицы
    const MobileTableView = ({ details }) => (
        <div className="md:hidden w-full mt-4 space-y-4">
            {details.map((detail) => (
                <div key={detail.GroupId} className="bg-[#f9f6ff] p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-[#8a48e6] text-sm font-bold">№ групи:</div>
                        <div className="text-[#827ead] text-sm">{detail.GroupId}</div>
                        <div className="text-[#8a48e6] text-sm font-bold">Назва групи:</div>
                        <div className="text-[#827ead] text-sm">{detail.GroupName}</div>
                        <div className="text-[#8a48e6] text-sm font-bold">Кількість учнів:</div>
                        <div className="text-[#827ead] text-sm">{detail.GroupAmountOfStudents}</div>
                        <div className="text-[#8a48e6] text-sm font-bold">Ціна:</div>
                        <div className="text-[#827ead] text-sm">{detail.GroupPrice}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full col-span-3 bg-white rounded-[20px] flex flex-col items-center transition-all duration-300 min-h-[268px] p-2 sm:p-4">
            <h2 className="text-[#120c38] text-xl sm:text-2xl font-bold font-['Nunito'] my-3 sm:my-5">Курси</h2>

            <div className="w-full sm:w-[95%] md:w-[90%] flex flex-col gap-3 sm:gap-4">
                {courses.map((course) => (
                    <div key={course.CourseId} className="w-full">
                        <button
                            className={`w-full h-10 flex items-center justify-between px-3 sm:px-5 rounded-[30px] border border-[#8a48e6] cursor-pointer transition-colors ${expandedCourses[course.CourseId] ? 'bg-[#8a48e6] text-white' : 'bg-white text-[#8a48e6]'}`}
                            onClick={() => toggleExpand(course.CourseId)}
                        >
                            <span className="text-sm sm:text-[15px] font-bold font-['Nunito']">{course.CourseName}</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="transform transition-transform duration-300"
                                style={{ transform: expandedCourses[course.CourseId] ? 'rotate(180deg)' : 'rotate(0)' }}
                            >
                                <path
                                    d="M12 14.5V15M12 15L18 9M12 15L6 9"
                                    stroke={expandedCourses[course.CourseId] ? 'white' : '#8A48E6'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {expandedCourses[course.CourseId] && (
                            <>
                                <DesktopTableView details={course.Groups} />
                                <MobileTableView details={course.Groups} />
                            </>
                        )}
                        {course !== courses[courses.length - 1] && <hr className="border-t border-[#f5eeff] mt-4" />}
                    </div>
                ))}
            </div>

            {
                !userFrom ?
                    (<button
                        className="w-full max-w-[418px] h-10 sm:h-12 mt-3 mb-3 sm:my-5 bg-[#8a4ae6] hover:bg-purple-700 rounded-xl sm:rounded-2xl text-white text-base sm:text-xl font-medium font-['Nunito'] flex items-center justify-center"
                        onClick={() => alert('Редагування курсів!')}
                    >
                        Редагувати курси
                    </button>)
                    :
                    (<button
                        className="w-full max-w-[418px] h-10 sm:h-12 mt-3 mb-3 sm:my-5 bg-[#8a4ae6] hover:bg-purple-700 rounded-xl sm:rounded-2xl text-white text-base sm:text-xl font-medium font-['Nunito'] flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Записатися на курс
                    </button>)
            }
            <CourseJoinModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courses={courses}
                userFrom={userFrom}
                teacher={teacher}
                user={user}
            />
        </div>
    );
};

export default CourseList;