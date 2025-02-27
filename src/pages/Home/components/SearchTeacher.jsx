import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

  return (
    <div className="bg-[#E0C8FF] w-[100%] h-[33vh] flex flex-col rounded-lg shadow-md justify-between">
      <div className="flex h-20 w-[100%] relative">
        <div className="flex p-4-lg p-3">
          {/* Вид навчання */}
          <select
            className="border pr-3 custom-select h-[48px] w-[156px] m-2"
            name="lessonType"
            value={filters.lessonType}
            onChange={handleFilterChange}
            style={{
              fontFamily: "Nunito",
              fontWeight: "700",
              fontSize: "12pt",
              lineHeight: "20.46pt",
              letterSpacing: "-0.5%",
              color: "#827FAE",
              border: "1px solid #D7D7D7",
              borderRadius: "9999px",
            }}
          >
            <option value="" disabled>
              Вид навчання
            </option>
            {lessonTypeOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            ))}
          </select>

          {/* Формат */}
          <select
            className="border pr-3 h-[48px] w-[156px] custom-select m-2"
            name="meetingType"
            value={filters.meetingType}
            onChange={handleFilterChange}
            style={{
              fontFamily: "Nunito",
              fontWeight: "700",
              fontSize: "12pt",
              lineHeight: "20.46pt",
              letterSpacing: "-0.5%",
              color: "#827FAE",
              border: "1px solid #D7D7D7",
              borderRadius: "9999px",
            }}
          >
            <option value="" disabled>
              Формат
            </option>
            {meetingTypeOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            ))}
          </select>
        </div>

        {/* Шукати */}
        <div className="m-4 h-12 justify-end items-center inline-flex">
          <Link to="/student/search">
            <div className="absolute top-[20px] right-[20px] w-[420px] h-12 px-4 py-2 bg-white rounded-[40px] justify-end items-center gap-2.5 flex border hover:border-[#8a48e6]">
              <div className="grow shrink basis-0 text-[#827ead] text-[15px] font-normal font-['Nunito']">
                Шукати
              </div>
              <div data-svg-wrapper>
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
            </div>
          </Link>
        </div>
      </div>

      {/* Блок вчителів */}
      <div className="flex flex-col h-[calc(33vh-80px)] mb-2 pb-2 overflow-y-auto">
        {/* стан загрузки */}
        {loading && <p>Загрузка...</p>}

        {/* Помилка 
        {error && <p className="text-center text-red-500">{error}</p>}*/}

        {/* Вчителі і наявність */}
        {teachers.length === 0 && !loading && error && (
          <p className="text-center text-gray-500">Немає доступних викладачів</p>
        )}

        {/* Картки вчителів */}
        {teachers.length > 0 && (
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher.TeacherId} className="relative my-1 mx-5">
                {/* Основний блок картки */}
                <div className="w-[100%] h-[138px] bg-white rounded-2xl border border-[#8a48e6]" />

                {/* Переглянути */}
                <div className="w-[200px] h-10 px-4 py-2 right-[20px] top-[83px] absolute bg-[#8a48e6] rounded-[40px] justify-center items-center gap-2.5 inline-flex">
                  <Link
                    to={`/teacher/profile/${teacher.TeacherId}`}
                    className="text-white text-[15px] font-bold font-['Nunito']"
                  >
                    Переглянути
                  </Link>
                </div>

                {/* Аватар і інформація про вчителя */}
                <div className="w-[290px] h-[60px] left-[21px] top-[15px] absolute">
                  <img
                    className="w-[60px] h-[60px] left-0 top-0 absolute rounded-full"
                    src={teacher.ImagePathUrl || "/assets/images/avatar.jpg"}
                    alt="profile"
                  />
                  <div className="w-auto left-[70px] top-[10px] absolute text-[#120c38] text-[15pt] font-bold font-['Nunito']">
                    {teacher.FullName || "Волкова Надія Миколаївна"}
                  </div>
                  <div className="w-auto left-[70px] top-[30px] absolute text-[#827fae] text-[12pt] font-normal font-['Lato']">
                    {teacher.SubjectName || "Математика"}
                  </div>
                </div>

                {/* Рейтинг вчителя */}
                <div className="w-[624px] h-[35px] left-[21px] top-[85px] absolute text-[#6f6f6f] text-[12pt] font-normal font-['Mulish']">
                  {teacher.AboutTeacher ||
                    "Привіт! Я, Надія Волкова, вчитель математики та фізики. Я маю власну методику навчання, а також розробила авторські матеріали що гарантує якісне засвоєння нових знань."}
                </div>

                {/* Ціна */}
                <div className="right-[60px] top-[29px] absolute text-center text-black text-2xl font-bold font-['Nunito']">
                  Від {teacher.LessonPrice} грн
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