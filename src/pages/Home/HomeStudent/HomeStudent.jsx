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
import { jwtDecode } from 'jwt-decode';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function HomeStudent() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [grades, setGrades] = useState([]);
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const [user, setUser] = useState(null);
  const [studentId, setStudentId] = useState(null);

  const location = useLocation();
    const { tokenServer } = useParams();

    useEffect(() => {
        console.log("tokenServer: ", tokenServer);
        if (tokenServer) {
            sessionStorage.setItem('token', tokenServer);
        }
    }, [tokenServer]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          toast.error(t('HomeStudent.errorNoToken'));
          return;
        }

        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          toast.error(t('HomeStudent.errorTokenDecode'));
          return;
        }

        const userId = decodedToken.id;

        if (!userId) {
          toast.error(t('HomeStudent.errorNoUserId'));
          return;
        }

        const studentResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/students/search/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!studentResponse.data.success || !studentResponse.data.data.length) {
          toast.error(t('HomeStudent.errorNoStudent'));
          return;
        }

        const student = studentResponse.data.data[0];
        setStudentId(student.StudentId);

        const [leadersResponse, gradesResponse, eventsResponse, daysResponse, userResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/students/${student.StudentId}/leaders`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/students/${student.StudentId}/grades`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/students/${student.StudentId}/events`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/students/${student.StudentId}/days`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/students/${student.StudentId}/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        setLeaders(leadersResponse.data);
        setGrades(gradesResponse.data.reverse());
        setEvents(eventsResponse.data.reverse());
        setDays(daysResponse.data);
        setUser(userResponse.data);

      } catch (error) {
        toast.error(t('HomeStudent.errorFetchData'));
      }
    };

    fetchStudentData();
  }, [t]);

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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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