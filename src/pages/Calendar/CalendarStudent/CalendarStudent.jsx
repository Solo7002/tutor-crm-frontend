import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import MyCalendar from "../CalendarTeacher/components/MyCalendar/MyCalendar";
import PanelLessons from "./components/PanelLessons/PanelLessons";
import Panel from "../CalendarTeacher/components/Panel/Panel";
import "./CalendarStudent.css";

const CalendarStudent = () => {
  const { t } = useTranslation();
  const [studentId, setStudentId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          toast.error(t("CalendarStudent.components.page.TokenDecodeError"), {
            position: "bottom-right",
            autoClose: 5000,
          });
          return;
        }

        const userId = decodedToken.id;

        if (!userId) {
          toast.error(t("CalendarStudent.components.page.UserIdNotFoundError"), {
            position: "bottom-right",
            autoClose: 5000,
          });
          return;
        }

        const studentResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/students/search/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const student = studentResponse.data.data[0];
        setStudentId(student.StudentId);

        if (student.StudentId) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_API_URL}/api/plannedLessons/getLessonByStudent/${student.StudentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLessons(response.data);
        }
      } catch (error) {
        toast.error(t("CalendarStudent.components.page.FetchLessonsError"), {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    };

    fetchLessons();
  }, [token, studentId, t]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const resetSelectedDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className="CalendarStudent">
      <div className="app-container">
        <div className={`app-content ${isMobile ? "flex-col" : ""}`}>
          <div className={isMobile ? "w-full" : "w-3/4"}>
            <Panel />
            <MyCalendar events={lessons} onDateSelect={handleDateSelect} />
          </div>
          <div className={`panelLesson ${isMobile ? "w-full mt-4" : ""}`}>
            <PanelLessons
              lessons={lessons}
              selectedDate={selectedDate}
              onResetDate={resetSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarStudent;