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

export default function HomeTeacher() {
    const [leaders, setLeaders] = useState([]);
    const [events, setEvents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [days, setDays] = useState([]);
    const [grades, setGrades] = useState([]);
    const [productivityData, setProductivityData] = useState(null);
    const [user, setUser] = useState(null);
    const [teacherId, setTeacherId] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
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

                const teacherResponse = await axios.get(`http://localhost:4000/api/teachers/search/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!teacherResponse.data.success || !teacherResponse.data.data.length) {
                    console.error('No teacher found for this user');
                    return;
                }

                const teacher = teacherResponse.data.data[0];
                console.log(teacher);
                
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
                console.error('Error fetching teacher data:', error.response?.data || error.message);
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