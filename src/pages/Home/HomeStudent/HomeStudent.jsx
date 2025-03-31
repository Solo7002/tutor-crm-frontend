import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./HomeStudent.css";
import Greetings from './components/Greetings';
import Leaderboard from './components/Leaderboard';
import MarkHistory from './components/MarkHistory';
import NearestEvents from './components/NearestEvents';
import Schedule from './components/Schedule';
import Graphic from './components/Graphic';
import SearchTeachers from './components/SearchTeacher';
//import Map from './components/Map';
import { jwtDecode } from 'jwt-decode';

export default function HomeStudent() {
  const [leaders, setLeaders] = useState([]);
  const [grades, setGrades] = useState([]);
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const [user, setUser] = useState(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('No token found in session storage');
          return;
        }

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

        if (!studentResponse.data.success || !studentResponse.data.data.length) {
          console.error('No student found for this user');
          return;
        }

        const student = studentResponse.data.data[0];
        setStudentId(student.StudentId);

        const [leadersResponse, gradesResponse, eventsResponse, daysResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/students/${student.StudentId}/leaders`),
          axios.get(`http://localhost:4000/api/students/${student.StudentId}/grades`),
          axios.get(`http://localhost:4000/api/students/${student.StudentId}/events`),
          axios.get(`http://localhost:4000/api/students/${student.StudentId}/days`),
          axios.get(`http://localhost:4000/api/students/${student.StudentId}/user`)
        ]);

        setLeaders(leadersResponse.data);
        setGrades(gradesResponse.data);
        setEvents(eventsResponse.data);
        setDays(daysResponse.data);
        setUser(userResponse.data);

      } catch (error) {
        console.error('Error fetching student data:', error.response?.data || error.message);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-[#F6EEFF] p-2 min-h-[90vh] overflow-hidden">
      {/* Общий контейнер для всех блоков */}
      <div className="flex flex-col w-full md:hidden">
        {/* Greetings */}
        <Greetings user={user} />
        {/* Graphic */}
        <Graphic chartData={grades} />
        {/* MarkHistory */}
        <MarkHistory grades={grades} />
        {/* NearestEvents */}
        <NearestEvents events={events} />

        <Leaderboard leaders={leaders} />
        {/* SearchTeachers - будет последним */}
        <SearchTeachers />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-row w-full">
        {/* Left col */}
        <div className="w-full md:w-9/12 pr-4 mb-2 md:mb-0">
          <Greetings user={user} />
          {/* Graphic and leader flex box */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 h-[30vh]">
            <Graphic chartData={grades} />
            <Leaderboard leaders={leaders} />
          </div>
          <SearchTeachers />
        </div>
        {/* Right col */}
        <div className="w-full md:w-3/12 ml-auto mr-4">
          <Schedule days={days} className="schedule-mobile-hidden" />
          <MarkHistory grades={grades} />
          <NearestEvents events={events} />
        </div>
      </div>
    </div>
  );
}