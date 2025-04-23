import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { encryptData } from '../../../../utils/crypto';
import Dropdown from "./Dropdown";

const SearchTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    lessonType: "",
    meetingType: "",
    aboutTeacher: "",
  });

  const lessonTypeOptions = [
    { key: "group", value: "Груповий" },
    { key: "solo", value: "Індивідуальний" },
  ];

  const meetingTypeOptions = [
    { key: "offline", value: "Офлайн" },
    { key: "online", value: "Онлайн" },
  ];

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `http://localhost:4000/api/students/searchTeachers?${queryParams}`
      );

      if (response.data.success) {
        setTeachers(response.data.data);
      } else if (response.data.message === "No teachers found.") {
        setTeachers([]);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setTeachers([]);
      setError(err.message || "Failed to fetch teachers.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const fractionalPart = (rating || 0) - fullStars;

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= fullStars;
          const partialFill = star === fullStars + 1 && fractionalPart > 0;
          const fillWidth = partialFill ? `${fractionalPart * 100}%` : "0%";

          return (
            <div key={star} className="relative w-5 h-5">
              <svg
                className="w-full h-full"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                  fill="none"
                  stroke="#8A48E6"
                  strokeWidth="1"
                />
                {(isFilled || partialFill) && (
                  <path
                    d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                    fill="#8A48E6"
                    style={partialFill ? { clipPath: `inset(0 ${100 - fractionalPart * 100}% 0 0)` } : {}}
                  />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#E0C8FF] w-full min-h-[33vh] flex flex-col rounded-[20px] shadow-md justify-between relative">
      <div className="flex flex-col sm:flex-row w-full">
        <div className="flex p-2 sm:p-4 gap-2">
          {/* Вид навчання */}
          <div className="w-full sm:w-auto min-w-[150px]">
            <Dropdown
              textAll="Вид навчання"
              options={lessonTypeOptions.map((option) => option.value)}
              onSelect={(value) => {
                const selectedOption = lessonTypeOptions.find(
                  (option) => option.value === value
                );
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  lessonType: selectedOption ? selectedOption.key : "",
                }));
              }}
            />
          </div>

          {/* Формат */}
          <div className="w-full sm:w-auto min-w-[150px]">
            <Dropdown
              textAll="Формат"
              options={meetingTypeOptions.map((option) => option.value)}
              onSelect={(value) => {
                const selectedOption = meetingTypeOptions.find(
                  (option) => option.value === value
                );
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  meetingType: selectedOption ? selectedOption.key : "",
                }));
              }}
            />
          </div>
        </div>

        {/* Шукати */}
        <div className="p-2 sm:p-4 self-center sm:ml-auto w-full justify-end">
          <Link to="/student/search" className="w-full ml-auto max-w-[420px] h-12 px-4 py-2 bg-white rounded-[40px] flex items-center justify-between border hover:border-[#8a48e6]">
            
              <div className="text-[#827ead] text-[15px] font-normal font-['Nunito']">
                Шукати
              </div>
              <div>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28 28L20 20M4 13.3333C4 14.559 4.24141 15.7727 4.71046 16.905C5.1795 18.0374 5.86699 19.0663 6.73367 19.933C7.60035 20.7997 8.62925 21.4872 9.76162 21.9562C10.894 22.4253 12.1077 22.6667 13.3333 22.6667C14.559 22.6667 15.7727 22.4253 16.905 21.9562C18.0374 21.4872 19.0663 20.7997 19.933 19.933C20.7997 19.0663 21.4872 18.0374 21.9562 16.905C22.4253 15.7727 22.6667 14.559 22.6667 13.3333C22.6667 12.1077 22.4253 10.894 21.9562 9.76162C21.4872 8.62925 20.7997 7.60035 19.933 6.73367C19.0663 5.86699 18.0374 5.1795 16.905 4.71046C15.7727 4.24141 14.559 4 13.3333 4C12.1077 4 10.894 4.24141 9.76162 4.71046C8.62925 5.1795 7.60035 5.86699 6.73367 6.73367C5.86699 7.60035 5.1795 8.62925 4.71046 9.76162C4.24141 10.894 4 12.1077 4 13.3333Z"
                    stroke="#120C38"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
          </Link>
        </div>
      </div>

      {/* Блок вчителів */}
      <div className="flex flex-col overflow-y-auto p-2">
        {/* стан загрузки */}
        {loading && (
          <div className="text-center py-4">Загрузка...</div>
        )}

        {/* Помилка */}
        {error && (
          <p className="text-center text-red-500 py-4">{error}</p>
        )}

        {/* Вчителі і наявність */}
        {teachers.length === 0 && !loading && error && (
          <p className="text-center text-gray-500 py-4">Немає доступних викладачів</p>
        )}

        {/* Картки вчителів */}
        {teachers.length > 0 && (
          <div className="h-[220px] px-3 scroll-auto space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher.TeacherId} className="bg-white rounded-2xl border border-[#8a48e6] p-4 relative">
                <div className="flex flex-col md:flex-row justify-between">
                  {/* Аватар і інформація про вчителя */}
                  <div className="flex mb-4 md:mb-0">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={teacher.ImagePathUrl || `https://ui-avatars.com/api/?name=${teacher.FullName}&background=random&size=86`}
                      alt="profile"
                    />
                    <div className="ml-4">
                      <div className="text-[#120c38] text-lg font-bold font-['Nunito']">
                        {teacher.FullName || "Волкова Надія Миколаївна"}
                      </div>
                      <div className="text-[#827fae] text-sm font-normal font-['Mulish']">
                        {teacher.SubjectName || "Математика"}
                      </div>
                      <div className="mt-1">
                        {renderStars(teacher.Rating)}
                      </div>
                    </div>
                  </div>

                  {/* Ціна */}
                  <div className="text-black text-xl font-bold font-['Nunito'] mb-4 md:mb-0">
                    Від {teacher.LessonPrice} грн
                  </div>
                </div>

                {/* Описание вчителя */}


                {/* Переглянути */}
                <div className="flex justify-between">
                <div className="text-[#6f6f6f] text-sm font-normal font-['Mulish'] mt-4 mb-4 line-clamp-2">
                  {teacher.AboutTeacher ||
                    "Привіт! Я, Надія Волкова, вчитель математики та фізики. Я маю власну методику навчання, а також розробила авторські матеріали що гарантує якісне засвоєння нових знань."}
                </div>
                  <Link
                    to={`/student/teacher_profile/${encryptData(teacher.TeacherId)}`}
                    className="inline-block h-[40px] px-4 py-2 bg-[#8a48e6] cursor-pointer rounded-[40px] text-white text-[15px] font-bold font-['Nunito'] hover:bg-[#7a3bd0] transition-colors"
                  >
                    Переглянути
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTeacher;