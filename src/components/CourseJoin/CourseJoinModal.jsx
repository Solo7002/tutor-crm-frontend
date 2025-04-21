import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import axios from 'axios';

const CourseJoinModal = ({ isOpen, onClose, courses, userFrom, teacher, user }) => {
    const [stage, setStage] = useState(1);
    const [formData, setFormData] = useState({
        course: '',
        group: '',
    });
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableGroups, setAvailableGroups] = useState([]);
    const [error, setError] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState(new Set());
    const [enrolledGroups, setEnrolledGroups] = useState(new Set());

    // Fetch the student's enrolled groups when the modal opens
    useEffect(() => {
        const fetchEnrolledGroups = async () => {
            try {
                if (userFrom?.UserId) {
                    const studentResponse = await axios.get(`http://localhost:4000/api/students/${userFrom.UserId}/info`);
                    const studentId = studentResponse.data.student.StudentId;

                    const enrolledGroupsResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/groups`);
                    const enrolledGroups = enrolledGroupsResponse.data.groups;

                    const enrolledCourseIds = new Set();
                    const enrolledGroupIds = new Set();
                    enrolledGroups.forEach(group => {
                        enrolledGroupIds.add(group.GroupId);
                        enrolledCourseIds.add(group.CourseId);
                    });

                    setEnrolledCourses(enrolledCourseIds);
                    setEnrolledGroups(enrolledGroupIds);
                }
            } catch (err) {
                console.error('Error fetching enrolled groups:', err);
                setError('Не вдалося завантажити інформацію про ваші групи. Спробуйте ще раз.');
            }
        };

        if (isOpen) {
            fetchEnrolledGroups();
        }
    }, [isOpen, userFrom]);

    // Filter available courses
    useEffect(() => {
        const filteredCourses = courses.filter(course => !enrolledCourses.has(course.CourseId));
        setAvailableCourses(filteredCourses);
    }, [courses, enrolledCourses]);

    // Filter available groups when a course is selected
    useEffect(() => {
        if (formData.course) {
            const selectedCourse = courses.find((course) => course.CourseName === formData.course);
            if (selectedCourse) {
                const filteredGroups = selectedCourse.Groups
                    .filter(group => !enrolledGroups.has(group.GroupId))
                    .map(group => ({ SubjectName: group.GroupName }));
                setAvailableGroups(filteredGroups);
            } else {
                setAvailableGroups([]);
            }
        } else {
            setAvailableGroups([]);
        }
    }, [formData.course, courses, enrolledGroups]);

    const handleCourseSelect = (course) => {
        setFormData((prev) => ({
            ...prev,
            course: course === 'Усі курси' ? '' : course,
            group: '',
        }));
    };

    const handleGroupSelect = (group) => {
        setFormData((prev) => ({
            ...prev,
            group: group === 'Усі групи' ? '' : group,
        }));
    };

    const getSelectedGroupDetails = () => {
        const selectedCourse = courses.find((course) => course.CourseName === formData.course);
        if (selectedCourse) {
            return selectedCourse.Groups.find((group) => group.GroupName === formData.group);
        }
        return null;
    };

    const handleNext = async () => {
        if (stage === 1 && formData.course && formData.group) {
            setStage(2);
        } else if (stage === 2) {
            const selectedGroup = getSelectedGroupDetails();
            const currentDate = new Date().toISOString();
            const requestData = {
                studentId: userFrom?.UserId,
                studentName: userFrom?.LastName + " " + userFrom?.FirstName,
                teacherId: user?.UserId,
                courseId: courses.find((course) => course.CourseName === formData.course)?.CourseId,
                groupId: selectedGroup?.GroupId,
                courseName: formData.course,
                groupName: formData.group,
                price: selectedGroup?.GroupPrice,
                type: selectedGroup?.Type,
                format: selectedGroup?.Format,
                date: currentDate,
            };
            try {
                const response = await axios.post('http://localhost:4000/api/notifications/join', requestData);
                setStage(3);
            } catch (err) {
                console.error('Server error:', err);
                setError('Не вдалося надіслати запит. Спробуйте ще раз.');
            }
        }
    };

    const handleClose = () => {
        setStage(1);
        setFormData({ course: '', group: '' });
        setAvailableGroups([]);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    const selectedGroup = getSelectedGroupDetails();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className={`relative bg-white rounded-[20px] p-6 w-full max-w-md ${stage === 3 ? 'min-h-[14rem]' : 'min-h-[20rem]'}`}>
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
    
                {stage === 1 && (
                    <div className="flex flex-col h-full">
                        <div className="text-center mb-8">
                            <h2 className="text-[#8A48E6] text-2xl font-bold font-['Nunito']">
                                Запис на курс
                            </h2>
                        </div>
    
                        <div className="space-y-6 flex-grow">
                            <div className="space-y-2">
                                <label className="text-[#120C38] text-base font-bold font-['Nunito'] block">
                                    Оберіть курс
                                </label>
                                <div className="w-full">
                                    <Dropdown
                                        textAll="Усі курси"
                                        options={availableCourses.map((course) => ({ SubjectName: course.CourseName }))}
                                        onSelectSubject={handleCourseSelect}
                                        disabled={availableCourses.length === 0}
                                        
                                    />
                                    {availableCourses.length === 0 && (
                                        <div className="mt-2 text-[#a6a6a8] text-xs font-['Nunito']">
                                            На жаль, немає доступних курсів для запису. Ви вже записані на всі доступні курси.
                                        </div>
                                    )}
                                </div>
                            </div>
    
                            <div className="space-y-2">
                                <label className="text-[#120C38] text-base font-bold font-['Nunito'] block">
                                    Оберіть групу
                                </label>
                                <div className="w-full">
                                    <Dropdown
                                        textAll="Усі групи"
                                        options={availableGroups}
                                        onSelectSubject={handleGroupSelect}
                                        disabled={!formData.course || availableGroups.length === 0}
                                    />
                                    {formData.course && availableGroups.length === 0 && (
                                        <div className="mt-2 text-[#a6a6a8] text-xs font-['Nunito']">
                                            На жаль, немає доступних груп для цього курсу. Ви вже записані на всі доступні групи.
                                        </div>
                                    )}
                                </div>
                            </div>
    
                            {error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {error}
                                </div>
                            )}
                        </div>
    
                        <div className="mt-6">
                            <button
                                onClick={handleNext}
                                className="w-full h-12 px-10 py-2 bg-[#8A4AE6] rounded-2xl flex justify-center items-center text-white text-xl font-medium font-['Nunito'] disabled:bg-gray-400 transition-colors"
                                disabled={!formData.course || !formData.group}
                            >
                                Далі
                            </button>
                        </div>
                    </div>
                )}
    
                {stage === 2 && (
                    <div className="flex flex-col h-full">
                        <div className="text-center mb-8">
                            <h2 className="text-[#8A48E6] text-2xl font-bold font-['Nunito']">
                                Запис на курс
                            </h2>
                        </div>
    
                        <div className="flex flex-col space-y-6 flex-grow">
                            <div className="text-center">
                                <span className="text-[#120C38] text-base font-bold font-['Nunito']">Вчитель: </span>
                                <span className="text-[#827EAD] text-base font-bold font-['Nunito']">{user?.FirstName} {user?.LastName}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[#120C38] text-base font-bold font-['Nunito']">Курс: </span>
                                    <span className="text-[#827EAD] text-base font-bold font-['Nunito']">{formData.course}</span>
                                </div>
                                <div className="md:text-right">
                                    <span className="text-[#120C38] text-base font-bold font-['Nunito']">Група: </span>
                                    <span className="text-[#827EAD] text-base font-bold font-['Nunito']">{formData.group}</span>
                                </div>
                                <div>
                                    <span className="text-[#120C38] text-base font-bold font-['Nunito']">Вид: </span>
                                    <span className="text-[#827EAD] text-base font-bold font-['Nunito']">{selectedGroup?.Type || 'Не вказано'}</span>
                                </div>
                                <div className="md:text-right">
                                    <span className="text-[#120C38] text-base font-bold font-['Nunito']">Формат: </span>
                                    <span className="text-[#827EAD] text-base font-bold font-['Nunito']">{selectedGroup?.Format || 'Не вказано'}</span>
                                </div>
                            </div>
                            
                            <div className="text-center mt-4">
                                <span className="text-[#120C38] text-base font-bold font-['Nunito']">Ціна за заняття: </span>
                                <span className="text-[#8A48E6] text-base font-bold font-['Nunito']">{selectedGroup?.GroupPrice || '0'}грн</span>
                            </div>
    
                            {error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {error}
                                </div>
                            )}
                        </div>
    
                        <div className="mt-6">
                            <button
                                onClick={handleNext}
                                className="w-full h-12 px-10 py-2 bg-[#8A4AE6] rounded-2xl flex justify-center items-center text-white text-xl font-medium font-['Nunito'] transition-colors hover:bg-[#7A3BD6]"
                            >
                                Надіслати запит
                            </button>
                        </div>
                    </div>
                )}
    
                {/* Stage 3: Success Message */}
                {stage === 3 && (
                    <div className="flex flex-col md:flex-row items-center h-full">
                        <div className="md:w-1/2 space-y-4">
                            <h2 className="text-black text-2xl font-bold font-['Nunito']">
                                Запит надіслано!
                            </h2>
                            <p className="text-[#827EAD] text-base font-normal font-['Mulish']">
                                Незабаром викладач додасть вас до курсу. Чекайте на сповіщення в повідомленнях
                            </p>
                            <Link
                                to={"/student/home"}
                                className="w-full h-12 px-10 py-2 bg-[#8A4AE6] rounded-2xl flex justify-center items-center text-white text-xl font-medium font-['Nunito'] transition-colors hover:bg-[#7A3BD6]"
                            >
                                На головну
                            </Link>
                        </div>
                        <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                            <svg className="w-32 h-auto md:w-40" viewBox="0 0 165 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_726_2190)">
                                    <path d="M0.384988 211.087C0.477866 211.75 0.630746 212.404 0.841747 213.04C2.14922 217.014 4.97093 220.311 8.6947 222.218C9.79734 222.797 10.9372 223.302 12.1066 223.731C21.6655 227.39 33.3707 226.834 42.4893 221.816C44.5994 220.65 46.4971 219.136 48.1025 217.337C51.2998 208.451 50.2653 198.586 49.7865 189.315C49.3077 179.895 48.4822 170.47 48.042 161.028C47.5852 151.338 44.7401 111.629 44.2779 101.934C42.1225 102.474 39.9353 102.879 37.7291 103.144C37.8832 108.333 40.3817 143.558 40.4807 148.752C40.6733 156.736 41.1521 164.709 41.3612 172.67C41.5923 180.544 42.2032 188.896 39.7488 196.478C37.3935 203.681 32.2591 208.182 26.3212 209.046C24.2479 209.354 22.1329 209.223 20.1137 208.66C17.8739 208.05 14.9462 206.878 13.9117 204.259C13.8613 204.174 13.8224 204.084 13.7961 203.989C13.1027 201.843 13.9667 199.373 15.1333 197.458C17.3016 193.892 20.0201 192.401 23.1789 190.448C25.4407 189.05 26.8605 184.682 22.9313 184.874C19.6294 185.028 15.9808 185.122 12.8551 186.619C7.43448 189.199 3.14205 196.038 1.24898 202.283C0.401497 205.111 -0.077274 208.176 0.384988 211.087Z" fill="#5224AA" />
                                    <path d="M128.222 211.087C128.127 211.751 127.972 212.404 127.76 213.04C126.454 217.015 123.632 220.313 119.907 222.218C118.805 222.799 117.665 223.305 116.495 223.731C106.936 227.39 95.2361 226.834 86.1175 221.816C84.0061 220.65 82.1081 219.133 80.5043 217.332C77.3015 208.446 78.3361 198.58 78.8148 189.309C79.2936 179.889 80.1191 170.464 80.5593 161.022C81.0216 151.333 83.8612 111.623 84.3234 101.928C86.4807 102.469 88.6697 102.873 90.8777 103.139C90.7236 108.328 88.2252 143.553 88.1261 148.747C87.9335 156.73 87.4547 164.703 87.2456 172.665C87.0145 180.539 86.3981 188.891 88.8525 196.473C91.2079 203.675 96.3423 208.176 102.28 209.04C104.353 209.349 106.468 209.218 108.488 208.655C110.727 208.044 113.661 206.872 114.695 204.253C114.744 204.168 114.782 204.077 114.811 203.983C115.499 201.838 114.635 199.367 113.468 197.452C111.305 193.887 108.581 192.396 105.422 190.443C103.161 189.045 101.746 184.676 105.67 184.869C108.972 185.023 112.626 185.116 115.746 186.613C121.167 189.194 125.459 196.033 127.358 202.278C128.222 205.111 128.69 208.176 128.222 211.087Z" fill="#5224AA" />
                                    <path d="M119.33 1.73338C95.6662 -3.76883 61.7945 3.93426 50.238 23.3681C21.6933 26.1467 0 46.846 0 67.1272C0 89.3451 26.0793 109.104 58.5917 109.104C58.9604 109.104 59.3181 109.071 59.6923 109.065C80.2135 109.065 86.7732 115.8 105.368 117.599C128.421 119.838 149.217 118.969 161.445 84.4426C174.102 48.6727 151.374 9.18337 119.33 1.73338Z" fill="#8A48E6" />
                                    <path d="M60.9916 237.696C59.7184 240.781 57.8653 243.594 55.5325 245.982C55.2541 246.316 54.9506 246.629 54.6245 246.917C53.5482 247.932 52.3864 248.853 51.152 249.668C50.6017 250.048 50.0129 250.4 49.4295 250.769C48.3691 251.353 47.2779 251.881 46.1607 252.348C45.814 252.491 45.4893 252.64 45.1371 252.755C44.2644 253.113 43.3692 253.412 42.4571 253.652C38.2522 254.82 33.8757 255.244 29.5248 254.906C29.3762 254.906 29.2606 254.879 29.1175 254.879C26.4472 254.681 23.7993 254.25 21.204 253.591C13.8519 251.787 7.07754 248.018 3.19784 241.162C-7.04896 223.126 10.5225 190.035 33.0578 196.688C33.2954 196.75 33.5289 196.827 33.7567 196.919C33.7567 196.919 33.8172 196.952 33.8447 196.952C34.4249 197.157 34.9345 197.524 35.314 198.008C35.3526 198.058 35.4131 198.091 35.4516 198.146C35.5122 198.245 35.6167 198.305 35.6662 198.415C36.3927 199.994 35.0224 201.684 33.6521 202.762C29.5083 206.03 24.2968 208.105 20.8959 212.16C16.752 217.035 16.0201 224.65 19.4926 230.02C25.5955 239.418 38.5554 237.2 43.2826 227.918C47.8777 218.911 46.3973 207.708 46.777 197.959C47.0687 190.371 46.777 182.756 46.5129 175.196C46.0176 159.933 45.0546 144.703 43.8549 129.467C43.1542 120.359 42.3562 111.255 41.461 102.154L64.3155 94.9462V205.232C64.3155 215.879 65.251 227.549 60.9916 237.696Z" fill="#8A48E6" />
                                    <path d="M64.3096 94.9407V205.233C64.3096 215.874 63.3685 227.566 67.6114 237.696C72.9219 250.395 85.8763 255.814 99.0783 254.873C109.32 254.142 120.056 250.532 125.405 241.145C135.669 223.104 118.103 190.013 95.5398 196.655C94.5107 196.957 93.4045 197.43 92.9533 198.404C92.2214 199.972 93.5972 201.706 94.9619 202.762C99.1278 206.063 104.317 208.11 107.74 212.149C111.884 217.029 112.61 224.644 109.127 230.014C103.03 239.401 90.0752 237.206 85.3425 227.924C80.7419 218.911 82.2277 207.686 81.848 197.931C81.5563 190.366 81.848 182.745 82.0956 175.179C82.6019 159.922 83.5595 144.681 84.7426 129.462C85.4525 120.344 86.2285 111.227 87.1585 102.127L64.3096 94.9407Z" fill="#8A48E6" />
                                    <path d="M86.0859 113.494C91.6716 115.145 97.4169 116.795 105.347 117.593C128.405 119.833 149.196 118.963 161.429 84.437C166.74 69.4489 165.832 53.8117 160.604 40.1442C164.94 53.6686 147.809 72.9869 134.838 75.5289C132.418 75.9641 130.167 77.0638 128.336 78.705C126.505 80.3461 125.166 82.4641 124.47 84.8221C117.316 110.484 86.1024 113.489 86.0859 113.494Z" fill="#5224AA" />
                                    <path d="M64.5399 42.8623C64.5399 42.8623 61.8323 37.4811 58.9707 35.0216C64.5674 32.3421 89.2764 31.7918 95.6105 35.0987C81.7701 36.3477 64.5399 42.8623 64.5399 42.8623Z" fill="#120C38" />
                                    <path d="M40.6402 38.8017C40.6402 38.8017 41.3226 32.8098 43.1552 29.5194C36.9807 28.9307 13.6034 36.9529 8.80469 42.2405C22.2213 38.6311 40.6402 38.8017 40.6402 38.8017Z" fill="#120C38" />
                                    <path d="M30.9218 75.1877C36.2041 75.1877 40.4863 70.9063 40.4863 65.6249C40.4863 60.3434 36.2041 56.062 30.9218 56.062C25.6396 56.062 21.3574 60.3434 21.3574 65.6249C21.3574 70.9063 25.6396 75.1877 30.9218 75.1877Z" fill="white" />
                                    <path d="M32.303 72.2991C35.2998 72.2991 37.7291 69.1237 37.7291 65.2067C37.7291 61.2897 35.2998 58.1144 32.303 58.1144C29.3063 58.1144 26.877 61.2897 26.877 65.2067C26.877 69.1237 29.3063 72.2991 32.303 72.2991Z" fill="#120C38" />
                                    <path d="M64.5741 110.237C64.5741 110.237 63.9688 147.245 63.9688 167.862C63.9688 188.478 64.3099 218.333 64.3099 218.333C64.3099 218.333 64.8603 181.892 64.8603 167.608C64.8603 153.325 64.6236 109.687 64.6236 109.687" fill="#120C38" />
                                    <path d="M80.7427 43.8196C75.3591 43.8229 70.1748 45.8563 66.2249 49.5139C62.275 53.1714 59.8502 58.1839 59.4346 63.5505H53.6068C53.18 58.0393 50.635 52.9075 46.5058 49.2317C42.3765 45.556 36.984 43.622 31.4594 43.8356C25.9349 44.0491 20.7078 46.3935 16.8746 50.377C13.0415 54.3605 10.9004 59.6734 10.9004 65.2012C10.9004 70.7289 13.0415 76.0419 16.8746 80.0254C20.7078 84.0089 25.9349 86.3533 31.4594 86.5668C36.984 86.7804 42.3765 84.8464 46.5058 81.1707C50.635 77.4949 53.18 72.3631 53.6068 66.8519H59.4346C59.7589 70.9962 61.2847 74.9561 63.8253 78.2468C66.3659 81.5374 69.8111 84.016 73.7389 85.379C77.6668 86.7421 81.9069 86.9304 85.9402 85.9211C89.9735 84.9117 93.6249 82.7485 96.4474 79.6961C99.2699 76.6438 101.141 72.8348 101.832 68.7355C102.522 64.6362 102.003 60.4246 100.336 56.6161C98.6693 52.8077 95.9282 49.5678 92.4482 47.293C88.9683 45.0182 84.9004 43.8073 80.7427 43.8086V43.8196ZM32.3152 83.4355C28.7113 83.4388 25.1873 82.3734 22.1889 80.374C19.1906 78.3747 16.8526 75.5313 15.4707 72.2033C14.0887 68.8754 13.7249 65.2124 14.4252 61.6778C15.1255 58.1431 16.8585 54.8954 19.4049 52.3455C21.9514 49.7956 25.197 48.058 28.7312 47.3525C32.2654 46.647 35.9295 47.0052 39.2601 48.3819C42.5907 49.7586 45.4381 52.0919 47.4423 55.0867C49.4465 58.0815 50.5174 61.6033 50.5196 65.2067C50.5203 67.5993 50.0495 69.9686 49.134 72.1792C48.2186 74.3898 46.8765 76.3984 45.1844 78.0902C43.4923 79.7821 41.4834 81.124 39.2724 82.0392C37.0614 82.9545 34.6917 83.4252 32.2987 83.4245L32.3152 83.4355ZM80.7427 83.4355C77.1389 83.4355 73.6161 82.3671 70.6197 80.3653C67.6233 78.3635 65.2879 75.5182 63.9088 72.1894C62.5297 68.8605 62.1689 65.1975 62.872 61.6636C63.575 58.1297 65.3104 54.8836 67.8586 52.3358C70.4068 49.7879 73.6535 48.0529 77.188 47.3499C80.7225 46.647 84.3861 47.0078 87.7155 48.3866C91.0449 49.7655 93.8906 52.1005 95.8927 55.0964C97.8949 58.0923 98.9635 61.6146 98.9635 65.2177C98.9606 70.0475 97.0396 74.6784 93.6229 78.0925C90.2061 81.5067 85.5732 83.4245 80.7427 83.4245V83.4355Z" fill="#120C38" />
                                    <path d="M88.4357 73.0474L76.5545 65.2067L88.4357 57.3606C88.6102 57.2571 88.7618 57.1193 88.8813 56.9555C89.0008 56.7917 89.0859 56.6053 89.1312 56.4077C89.1765 56.21 89.1811 56.0052 89.1448 55.8057C89.1085 55.6062 89.0321 55.4161 88.9201 55.247C88.8081 55.078 88.6629 54.9334 88.4934 54.8222C88.3238 54.7109 88.1334 54.6353 87.9337 54.5998C87.734 54.5644 87.5292 54.5699 87.3317 54.616C87.1342 54.6621 86.9481 54.7479 86.7848 54.8681L73.027 63.9522C72.8595 64.0627 72.716 64.2059 72.6054 64.3733C72.4947 64.5407 72.4191 64.7287 72.3831 64.9261C72.3749 65.0195 72.3749 65.1134 72.3831 65.2067C72.3749 65.3001 72.3749 65.394 72.3831 65.4874C72.4191 65.6847 72.4947 65.8728 72.6054 66.0402C72.716 66.2076 72.8595 66.3508 73.027 66.4613L86.7848 75.5454C86.9488 75.6538 87.1326 75.7288 87.3257 75.7662C87.5187 75.8035 87.7172 75.8025 87.9099 75.7632C88.1025 75.7238 88.2856 75.6469 88.4485 75.5369C88.6114 75.4268 88.7511 75.2858 88.8595 75.1217C88.9679 74.9577 89.0429 74.774 89.0803 74.5809C89.1176 74.3879 89.1166 74.1894 89.0773 73.9968C89.0379 73.8042 88.961 73.6212 88.8509 73.4583C88.7409 73.2954 88.5998 73.1558 88.4357 73.0474Z" fill="#120C38" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_726_2190">
                                        <rect width="165" height="255" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseJoinModal;