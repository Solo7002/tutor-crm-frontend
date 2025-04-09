
import MyCalendar from "../CalendarTeacher/components/MyCalendar/MyCalendar";
import PanelLessons from "./components/PanelLessons/PanelLessons";
import Panel from "../CalendarTeacher/components/Panel/Panel";
import { useEffect,useState } from "react";
import axios from "axios";
import "./CalendarStudent.css";
const CalendarStudent =()=>{
    const token = "";
    const studentId = 2;
    const [lessons, setLessons] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    useEffect(() => {
        const fetchLessons = async () => {
          try {
            const response = await axios.get(
              `http://localhost:4000/api/plannedLessons/getLessonByStudent/${studentId}`,
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
      }, [token, studentId]);
    
      const handleDateSelect = (date) => {
        setSelectedDate(date);
      };
    
      const resetSelectedDate = () => {
        setSelectedDate(null);
      };
    return(
        <div className="app-container">
        <div className="app-content ">
          <div className="w-3/4">
            <Panel />
            <MyCalendar events={lessons} onDateSelect={handleDateSelect} />
          </div>
          <div className="panelLesson">
            <PanelLessons
           
              token={token}
              lessons={lessons}
              selectedDate={selectedDate}
              onResetDate={resetSelectedDate} 
            />
          </div>
        </div>
      </div>
    )
}

export default CalendarStudent;