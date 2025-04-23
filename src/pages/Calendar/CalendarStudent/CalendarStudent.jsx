import MyCalendar from "../CalendarTeacher/components/MyCalendar/MyCalendar";
import PanelLessons from "./components/PanelLessons/PanelLessons";
import Panel from "../CalendarTeacher/components/Panel/Panel";
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import "./CalendarStudent.css";

const CalendarStudent = () => {
    const [studentId, setStudentId] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const token = sessionStorage.getItem('token');
    
    useEffect(() => {
        const fetchLessons = async () => {
          try {
            let decodedToken;
            try {
              decodedToken = jwtDecode(token);
            } catch (error) {
              console.error('Error decoding token:', error);
              return;
            }
         
            const userId = decodedToken.id;
         
            if (!userId) {
              console.error('User ID not found in token');
              return;
            }
            const studentResponse = await axios.get(`http://localhost:4000/api/students/search/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const student = studentResponse.data.data[0];
            setStudentId(student.StudentId);
            
            if (student.StudentId) {
              const response = await axios.get(
                `http://localhost:4000/api/plannedLessons/getLessonByStudent/${student.StudentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setLessons(response.data);
            }
          } catch (error) {
            console.error("Error fetching lessons:", error);
          }
        };
   
        fetchLessons();
    }, [token, studentId]);

    useEffect(() => {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 1000);
      };
      checkIfMobile();
      window.addEventListener('resize', checkIfMobile);
      return () => window.removeEventListener('resize', checkIfMobile);
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
        <div className={`app-content ${isMobile ? 'flex-col' : ''}`}>
          <div className={isMobile ? 'w-full' : 'w-3/4'}>
            <Panel />
            <MyCalendar events={lessons} onDateSelect={handleDateSelect} />
          </div>
          <div className={`panelLesson ${isMobile ? 'w-full mt-4' : ''}`}>
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