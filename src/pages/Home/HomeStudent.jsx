import React, { useEffect, useState } from 'react';
//import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import "./HomeStudent.css";
import Greetings from './components/Greetings';
import Leaderboard from './components/Leaderboard';
import MarkHistory from './components/MarkHistory';
import NearestEvents from './components/NearestEvents';
import Schedule from './components/Schedule';
import Graphic from './components/Graphic';
//import Map from './components/Map';

export default function HomeStudent() {
  const [leaders, setLeaders] = useState([]);
  const [grades, setGrades] = useState([]); // Оценки
  const [events, setEvents] = useState([]); // Ближайшие события
  //const [chartData, setChartData] = useState([]); // Данные для графика
  const [days, setDays] = useState([]); // Расписание дней

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

        // Шаг 2: Запрос к API для получения лидеров
        const leadersResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/leaders`);
        setLeaders(leadersResponse.data);


        // Шаг 3: Запрос к API для получения оценок (предположим, что есть такой эндпоинт)
        const gradesResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/grades`);
        setGrades(gradesResponse.data);

        // Шаг 4: Запрос к API для получения событий (предположим, что есть такой эндпоинт)
        const eventsResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/events`);
        setEvents(eventsResponse.data);

        // Шаг 5: Запрос к API для получения данных графика (предположим, что есть такой эндпоинт)
        //const chartDataResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/chart-data`);
        //setChartData(chartDataResponse.data);

        // Шаг 6: Запрос к API для получения расписания дней (предположим, что есть такой эндпоинт)
         const daysResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/days`);
         setDays(daysResponse.data);

      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);
  //const leaders = [
  //  { name: "Восьменко Оксана Сергіївна", subject: "Математика", image: "/assets/images/avatar.jpg" },
  //  { name: "Осімова Вікторія Андріївна", subject: "Фізика", image: "/assets/images/avatar.jpg" },
  //  { name: "Іваненко Іван Іванович", subject: "Хімія", image: "/assets/images/avatar.jpg" },
  //  { name: "Петренко Марія Сергіївна", subject: "Біологія", image: "/assets/images/avatar.jpg" },
  //];

  //const grades = [
  //  { subject: 'Математична фізика', grade: 12, date: '12.01.2024', type: 'Homework' },
  //  { subject: 'Хімія', grade: 10, date: '12.01.2024', type: 'Test' },
  //  { subject: 'Англійська мова', grade: 9, date: '12.01.2024', type: 'Classwork' },
  //  { subject: 'Математична фізика', grade: 12, date: '12.01.2024', type: 'Homework' },
  //];

  // const events = [
  //   { title: 'Фізика', date: '12.01.2024', time: '12:00 - 13:30', image: '/assets/images/avatar.jpg', link: '/' },
  //   { title: 'Математична фізика', date: '12.01.2024', time: '13:30 - 15:00', image: '/assets/images/avatar.jpg', link: '/' },
  //   { title: 'Англійська мова', date: '12.01.2024', time: '13:30 - 15:00', image: '/assets/images/avatar.jpg', link: '/' },
  // ];

  // const days = [
  //   { date: '2025-2-01', type: 'Lesson' },
  //   { date: '2025-2-05', type: 'Homework' },
  // ];

  // const chartData = [
  //   { date: "2025-02-15", score: 10, type: "Homework" },
  //   { date: "2025-02-01", score: 12, type: "Classwork" },
  //   { date: "2025-01-20", score: 9, type: "Homework" },
  //   { date: "2025-01-05", score: 8, type: "Classwork" },
  //   { date: "2024-12-15", score: 11, type: "Homework" },
  //   { date: "2024-12-01", score: 7, type: "Classwork" },
  //   { date: "2024-11-20", score: 10, type: "Homework" },
  //   { date: "2024-11-05", score: 12, type: "Classwork" },
  //   { date: "2024-10-15", score: 8, type: "Homework" },
  //   { date: "2024-10-01", score: 9, type: "Classwork" },
  //   { date: "2024-09-20", score: 7, type: "Homework" },
  //   { date: "2024-09-05", score: 11, type: "Classwork" },
  // ];

  return (
    <div className="flex flex-col md:flex-row bg-[#F6EEFF] p-2 min-h-[90vh] overflow-hidden">
      {/* Left col */}
      <div className="w-full md:w-9/12 pr-4 mb-2 md:mb-0">
        <Greetings />
        {/* Graphic and leader flex box */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 h-[30vh]">
          <Graphic chartData={grades} />
          <Leaderboard leaders={leaders} />
        </div>

        {/* Map */}
        <div className="bg-white h-[33vh] flex items-center justify-center rounded-lg shadow-md">
          {/* <p>Мапа</p>*/}
        </div>
        {/*<Map />*/}
      </div>
      {/* Right col */}
      <div className="w-full md:w-3/12 ml-auto mr-4">
        <Schedule days={days} />
        <MarkHistory grades={grades} />
        <NearestEvents events={events} />
      </div>
    </div>
  );
}