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
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function HomeTeacher() {
    const [leaders, setLeaders] = useState([]);
    const [events, setEvents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [days, setDays] = useState([]);
    const [grades, setGrades] = useState([]);
    const [productivityData, setProductivityData] = useState(null);
    const [user, setUser] = useState(null);
    const [teacherId, setTeacherId] = useState(null);

    const location=useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tokenServer = searchParams.get('token');
    if(tokenServer){
      sessionStorage.setItem('token',tokenServer);
    }

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    toast.error('Токен не знайдено в сховищі сесії!');
                    return;
                }

                let decodedToken;
                try {
                    decodedToken = jwtDecode(token);
                } catch (error) {
                    toast.error('Ошибка при расшифровке токена!');
                    return;
                }

                const userId = decodedToken.id;

                if (!userId) {
                    toast.error('User ID не знайдено в токені!');
                    return;
                }

                const teacherResponse = await axios.get(`http://localhost:4000/api/teachers/search/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!teacherResponse.data.success || !teacherResponse.data.data.length) {
                    toast.error('Вчитель не знайдено для цього користувача!');
                    return;
                }

                const teacher = teacherResponse.data.data[0];
                
                setTeacherId(teacher.TeacherId);

                const [userResponse, leadersResponse, activitiesResponse, eventsResponse,
                    daysResponse, gradesResponse, productivityResponse] = await Promise.all([
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/user`),
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/leaders`),
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/activities`),
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/events`),
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/days`),
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/grades`),
                        axios.get(`http://localhost:4000/api/teachers/${teacher.TeacherId}/productivity`)
                    ]);

                setUser(userResponse.data);
                setLeaders(leadersResponse.data);
                setActivities(activitiesResponse.data);
                setEvents(eventsResponse.data);
                setDays(daysResponse.data);
                setGrades(gradesResponse.data);
                setProductivityData(productivityResponse.data);

            } catch (error) {
                toast.error('Помилка при отриманні даних вчителя!');
            }
        };

        fetchTeacherData();
    }, []);

    return (
        <div className="flex flex-col bg-[#F6EEFF] p-2 sm:p-4 min-h-[90vh] max-w-full overflow-x-hidden">
            {/* Mobile Layout */}
            <div className="flex flex-col w-full lg:hidden space-y-4 min-h-[90vh]">
                <div className="w-full">
                    <Greetings user={user || {}} />
                </div>
                <div className="w-full">
                    <Productivity productivityData={productivityData || {}} />
                </div>
                <div className="w-full">
                    <LatestActivity activities={activities} />
                </div>
                <div className="w-full">
                    <NearestEvents events={events} />
                </div>
                <div className="w-full">
                    <Leaderboard leaders={leaders} />
                </div>
                <div className="w-full">
                    <Graphic chartData={grades} />
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex w-full">
                <div className="flex flex-col lg:flex-row w-full gap-4">
                    {/* Left column - 75% on large screens */}
                    <div className="w-full lg:w-3/4 space-y-4">
                        <div className="w-full">
                            <Greetings user={user || {}} />
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 w-full h-[30vh]">
                            <div className="w-full md:w-1/2">
                                <Productivity productivityData={productivityData || {}} />
                            </div>
                            <div className="w-full md:w-1/2">
                                <Leaderboard leaders={leaders} />
                            </div>
                        </div>
                        
                        <div className="w-full">
                            <Graphic chartData={grades} />
                        </div>
                    </div>
                    
                    {/* Right column - 25% on large screens */}
                    <div className="w-full lg:w-1/4 space-y-4">
                        <div className="w-full">
                            <Schedule days={days} />
                        </div>
                        <div className="w-full">
                            <LatestActivity activities={activities} />
                        </div>
                        <div className="w-full">
                            <NearestEvents events={events} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}