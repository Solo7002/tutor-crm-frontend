import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./HomeTeacher.css";
import Greetings from './components/Greetings';
import Leaderboard from './components/Leaderboard';
import LatestActivity from './components/LatestActivity';
import NearestEvents from './components/NearestEvents';
import Schedule from './components/Schedule';
import Graphic from './components/Graphic';
import Productivity from './components/Productivity';
// import { jwtDecode } from 'jwt-decode';

export default function HomeTeacher() {
    const [leaders, setLeaders] = useState([]);
    const [events, setEvents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [days, setDays] = useState([]);
    const [grades, setGrades] = useState([]);
    const [productivityData, setProductivityData] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                // Получение teacherId из токена (раскомментируйте при использовании)
                /* const token = sessionStorage.getItem('token');
                if (!token) {
                    console.error('No token found in session storage');
                    return;
                }
                const decodedToken = jwtDecode(token);
                const teacherId = decodedToken.teacherId; */

                const teacherId = 3; // Заглушка для тестирования

                if (!teacherId) {
                    console.error('Teacher ID not found');
                    return;
                }

                // Запрос данных пользователя преподавателя
                const userResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/user`);
                setUser(userResponse.data);

                // Запрос лидеров
                const leadersResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/leaders`);
                setLeaders(leadersResponse.data);

                // Запрос последних активностей
                const activitiesResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/activities`);
                setActivities(activitiesResponse.data);

                // Запрос ближайших событий
                const eventsResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/events`);
                setEvents(eventsResponse.data);

                // Запрос дней расписания
                const daysResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/days`);
                setDays(daysResponse.data);

                // Запрос оценок
                const gradesResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/grades`);
                setGrades(gradesResponse.data);

                // Запрос данных продуктивности
                const productivityResponse = await axios.get(`http://localhost:4000/api/teachers/${teacherId}/productivity`);
                setProductivityData(productivityResponse.data);

            } catch (error) {
                console.error('Error fetching teacher data:', error);
            }
        };

        fetchTeacherData();
    }, []);

    return (
        <div className="flex flex-col md:flex-row bg-[#F6EEFF] p-2 min-h-[90vh] overflow-hidden">
            <div className="flex flex-col w-full md:hidden space-y-4">
                <Greetings user={user || {}} />
                <Productivity productivityData={productivityData || {}} />
                <LatestActivity activities={activities} />
                <NearestEvents events={events} />
                <Leaderboard leaders={leaders} />
                <Graphic chartData={grades} />
            </div>
            <div className="hidden md:flex md:flex-row w-full">
                {/* Left col */}
                <div className="w-full md:w-9/12 pr-4 mb-2 md:mb-0">
                    <Greetings user={user || {}} />
                    {/* Graphic and leader flex box */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 h-[30vh]">
                        <Productivity productivityData={productivityData || {}} />
                        <Leaderboard leaders={leaders} />
                    </div>
                    <Graphic chartData={grades} />
                </div>
                {/* Right col */}
                <div className="w-full md:w-3/12 ml-auto mr-4">
                    <Schedule days={days} />
                    <LatestActivity activities={activities} />
                    <NearestEvents events={events} />
                </div>
            </div>
        </div>
    );
}