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
//import {jwtDecode} from 'jwt-decode';

export default function HomeStudent() {
  const [leaders, setLeaders] = useState([]);
  const [grades, setGrades] = useState([]);
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get studentId by token
        /* const token = sessionStorage.getItem('token');
         if (!token) {
           console.error('No token found in session storage');
           return;
         }
         const decodedToken = jwtDecode(token);*/

        const studentId = 1; //decodedToken.studentId; // Поле studentId должно быть в токене

        if (!studentId) {
          console.error('Student ID not found in token');
          return;
        }

        const leadersResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/leaders`);
        setLeaders(leadersResponse.data);

        const gradesResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/grades`);
        setGrades(gradesResponse.data);

        const eventsResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/events`);
        setEvents(eventsResponse.data);

        const daysResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/days`);
        setDays(daysResponse.data);

        const userResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/user`);
        console.log(userResponse);
        
        setUser(userResponse.data);

      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-[#F6EEFF] p-2 min-h-[90vh] overflow-hidden">
      {/* Общий контейнер для всех блоков */}
      <div className="flex flex-col w-full md:hidden">
        {/* Greetings */}
        <Greetings user={user}/>
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
          <Greetings user={user}/>
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