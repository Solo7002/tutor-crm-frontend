import "./CalendarTeacher.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ChangeDayModal from "./components/ChangeDayModal/ChangeDayModal";
import MyCalendar from "./components/MyCalendar/MyCalendar";
import Panel from "./components/Panel/Panel";
import PanelLessons from "./components/PanelLessons/PanelLessons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CalendarTeacher = () => {
  const { t } = useTranslation();
  const [teacherId, setTeacherId] = useState();
  const [lessons, setLessons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const token = sessionStorage.getItem("token");

  const fetchTeacherAndLessons = async () => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.id;

      if (!userId) return;

      const teacherRes = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/teachers/search/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const teacher = teacherRes.data.data[0];
      if (!teacher?.TeacherId) return;

      setTeacherId(teacher.TeacherId);

      const lessonsRes = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/plannedLessons/getLessonByTecher/${teacher.TeacherId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLessons(lessonsRes.data);
    } catch (err) {
      toast.error(t("CalendarTeacher.components.Messages.FetchError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    fetchTeacherAndLessons();
  }, [token]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, [t]);

  const handleDateSelect = (date) => setSelectedDate(date);
  const resetSelectedDate = () => setSelectedDate(null);

  return (
    <div className="TeacherCalendar">
      <div className="app-container">
        <div className={`app-content ${isMobile ? "flex-col" : ""}`}>
          <div className={isMobile ? "w-full" : "w-3/4"}>
            <Panel />
            <MyCalendar events={lessons} onDateSelect={handleDateSelect} />
          </div>
          <div className={`panelLesson ${isMobile ? "w-full mt-4" : ""}`}>
            <PanelLessons
              teacherId={teacherId}
              token={token}
              lessons={lessons}
              selectedDate={selectedDate}
              onResetDate={resetSelectedDate}
              onRefresh={fetchTeacherAndLessons}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTeacher;