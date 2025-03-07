import "./CalendarTeacher.css";
import { useState, useEffect } from "react";
import ChangeDayModal from "./components/ChangeDayModal/ChangeDayModal";
import MyCalendar from "./components/MyCalendar/MyCalendar";
import Panel from "./components/Panel/Panel";
import PanelLessons from "./components/PanelLessons/PanelLessons";
import axios from "axios";

const CalendarTeacher = () => {
  const token = "";
  const teacherId = 1;
  const [lessons, setLessons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/plannedLessons/getLessonByTecher/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, [token, teacherId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const resetSelectedDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className="app-container">
      <div className="app-content ">
        <div className="w-3/4">
          <Panel />
          <MyCalendar events={lessons} onDateSelect={handleDateSelect} />
        </div>
        <div className="panelLesson">
          <PanelLessons
            teacherId={teacherId}
            token={token}
            lessons={lessons}
            selectedDate={selectedDate}
            onResetDate={resetSelectedDate} 
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarTeacher;