import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import "./HomeTeacher.css";
import Greetings from './components/Greetings';
import Leaderboard from './components/Leaderboard';
import LatestActivity from './components/LatestActivity';
import NearestEvents from './components/NearestEvents';
import Schedule from './components/Schedule';
import Graphic from './components/Graphic';
import Productivity from './components/Productivity';
//import {jwtDecode} from 'jwt-decode';

export default function HomeTeacher() {
    const [leaders, setLeaders] = useState([
        {
            name: "John Doe",
            subject: "Математика",
            image: "/assets/images/john.jpg",
            email: "john.doe@example.com",
        },
        {
            name: "Jane Smith",
            subject: "Фізика",
            image: "/assets/images/jane.jpg",
            email: "jane.smith@example.com",
        },
        {
            name: "Alice Johnson",
            subject: "Математика",
            image: "/assets/images/alice.jpg",
            email: "alice.johnson@example.com",
        },
        {
            name: "Bob Brown",
            subject: "Хімія",
            image: null, // Будет использовано значение по умолчанию
            email: "bob.brown@example.com",
        },
    ]);
    const [activities, setActivities] = useState([
        {
            date: "12.01.2024",
            name: "Щупальцев Дмитро Олегович",
            image: "https://placehold.co/34x34",
            subject: "Математична фізика",
            type: "Домашня робота",
        },
        {
            date: "13.01.2024",
            name: "Іванов Петро Сергійович",
            image: null,
            subject: "Програмування",
            type: "Тест",
        },
        {
            date: "14.01.2024",
            name: "Сидоренко Анна Ігорівна",
            image: "https://placehold.co/34x34",
            subject: "Фізика",
            type: "Домашня робота",
        },
        {
            date: "15.01.2024",
            name: "Коваленко Олена Василівна",
            image: null,
            subject: "Хімія",
            type: "Тест",
        },
        {
            date: "15.01.2024",
            name: "Коваленко Олена Василівна",
            image: null,
            subject: "Хімія",
            type: "Тест",
        },
        {
            date: "15.01.2024",
            name: "Коваленко Олена Василівна",
            image: null,
            subject: "Хімія",
            type: "Тест",
        },
    ]);
    const [events, setEvents] = useState([
        {
            title: "Урок математики",
            date: "2025-03-05",
            time: "14:00 - 15:00",
            image: null,
            link: "https://example.com/math-lesson",
        },
        {
            title: "Лекція з фізики",
            date: "2025-03-06",
            time: "10:00 - 11:30",
            image: null,
            link: "https://example.com/physics-lecture",
        },
        {
            title: "Практика з хімії",
            date: "2025-03-07",
            time: "16:00 - 17:00",
            image: null, // Будет использовано значение по умолчанию
            link: "https://example.com/chemistry-practice",
        },
    ]);
    const [days, setDays] = useState([
        {
            date: "2025-03-04",
            type: "Lesson",
        },
        {
            date: "2025-03-06",
            type: "Homework",
        },
        {
            date: "2025-03-07",
            type: "Lesson",
        },
        {
            date: "2025-03-10",
            type: "Homework",
        },
    ]);
    const [grades, setGrades] = useState([
        // Жовтень 2024
        { group: "Група 1", grade: 10, type: "Homework", date: "2024-10-05" },
        { group: "Група 1", grade: 9, type: "Homework", date: "2024-10-15" },
        { group: "Група 2", grade: 8, type: "Classwork", date: "2024-10-10" },
        { group: "Група 2", grade: 7, type: "Classwork", date: "2024-10-20" },
        { group: "Група 1", grade: 11, type: "Test", date: "2024-10-25" },

        // Листопад 2024
        { group: "Група 1", grade: 8, type: "Homework", date: "2024-11-01" },
        { group: "Група 2", grade: 10, type: "Homework", date: "2024-11-12" },
        { group: "Група 1", grade: 9, type: "Classwork", date: "2024-11-15" },
        { group: "Група 2", grade: 12, type: "Classwork", date: "2024-11-20" },
        { group: "Група 1", grade: 6, type: "Test", date: "2024-11-25" },
        { group: "Група 2", grade: 10, type: "Test", date: "2024-11-28" },

        // Грудень 2024
        { group: "Група 1", grade: 11, type: "Homework", date: "2024-12-05" },
        { group: "Група 2", grade: 9, type: "Homework", date: "2024-12-10" },
        { group: "Група 1", grade: 8, type: "Classwork", date: "2024-12-15" },
        { group: "Група 2", grade: 11, type: "Test", date: "2024-12-20" },

        // Січень 2025
        { group: "Група 1", grade: 9, type: "Homework", date: "2025-01-10" },
        { group: "Група 2", grade: 10, type: "Homework", date: "2025-01-15" },
        { group: "Група 1", grade: 11, type: "Classwork", date: "2025-01-18" },
        { group: "Група 2", grade: 7, type: "Classwork", date: "2025-01-20" },
        { group: "Група 1", grade: 12, type: "Test", date: "2025-01-25" },

        // Лютий 2025
        { group: "Група 1", grade: 8, type: "Homework", date: "2025-02-01" },
        { group: "Група 2", grade: 12, type: "Classwork", date: "2025-02-05" },
        { group: "Група 1", grade: 10, type: "Classwork", date: "2025-02-10" },
        { group: "Група 2", grade: 9, type: "Test", date: "2025-02-15" },
        { group: "Група 1", grade: 11, type: "Test", date: "2025-02-20" },

        // Березень 2025
        { group: "Група 1", grade: 7, type: "Homework", date: "2025-03-01" },
        { group: "Група 2", grade: 10, type: "Homework", date: "2025-03-03" },
        { group: "Група 1", grade: 9, type: "Classwork", date: "2025-03-04" },
        { group: "Група 2", grade: 8, type: "Test", date: "2025-03-05" },
        { group: "Група 1", grade: 7, type: "Test", date: "2025-03-10" },
    ]);
    const [productivityData, setProductivityData] = useState({
        tasksChecked: 100,
        prevTasksChecked: 90, // зеленая стрелка вверх
        lessonsConducted: 50,
        prevLessonsConducted: 50, // черная палочка
        newClients: 20,
        prevNewClients: 15, // (+5) зеленым
        reviewsReceived: 30,
        prevReviewsReceived: 35, // (-5) красным
        rating: 4.6,
    });
    const [user, setUser] = useState({
        email: "test@example.com",
        firstName: "John",
        image: "/assets/images/avatar.jpg",
        lastName: "Doe",
        userId: 1,
        username: "testUser",
    });
    //   useEffect(() => {
    //     const fetchTeacherData = async () => {
    //       try {
    //         // Get teacherId by token
    //         /* const token = sessionStorage.getItem('token');
    //          if (!token) {
    //            console.error('No token found in session storage');
    //            return;
    //          }
    //          const decodedToken = jwtDecode(token);*/

    //         const teacherId = 1; //decodedToken.teacherId; // Поле teacherId должно быть в токене

    //         if (!teacherId) {
    //           console.error('Teacher ID not found in token');
    //           return;
    //         }

    //         const leadersResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/leaders`);
    //         setLeaders(leadersResponse.data);

    //         const gradesResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/grades`);
    //         setGrades(gradesResponse.data);

    //         const eventsResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/events`);
    //         setEvents(eventsResponse.data);

    //         const daysResponse = await axios.get(`http://localhost:4000/api/students/${studentId}/days`);
    //         setDays(daysResponse.data);

    //       } catch (error) {
    //         console.error('Error fetching student data:', error);
    //       }
    //     };

    //     fetchStudentData();
    //   }, []);

    return (
        <div className="flex flex-col md:flex-row bg-[#F6EEFF] p-2 min-h-[90vh] overflow-hidden">
            <div className="flex flex-col w-full md:hidden space-y-4">
                <Greetings user={user} />
                <Productivity productivityData={productivityData} />
                <LatestActivity activities={activities} />
                <NearestEvents events={events} />
                <Leaderboard leaders={leaders} />
                <Graphic chartData={grades} />
            </div>
            <div className="hidden md:flex md:flex-row w-full">
                {/* Left col */}
                <div className="w-full md:w-9/12 pr-4 mb-2 md:mb-0">
                    <Greetings user={user} />
                    {/* Graphic and leader flex box */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 h-[30vh]">
                        <Productivity productivityData={productivityData} />
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