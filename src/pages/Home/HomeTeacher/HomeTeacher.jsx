import React/*, { useEffect, useState }*/ from 'react';
//import axios from 'axios';
import "./HomeTeacher.css";
// import Greetings from './components/Greetings';
// import Leaderboard from './components/Leaderboard';
// import MarkHistory from './components/MarkHistory';
// import NearestEvents from './components/NearestEvents';
// import Schedule from './components/Schedule';
// import Graphic from './components/Graphic';
// import SearchTeachers from './components/SearchTeacher';
//import Map from './components/Map';
//import {jwtDecode} from 'jwt-decode';

export default function HomeTeacher() {
    //   const [leaders, setLeaders] = useState([]);
    //   const [grades, setGrades] = useState([]);
    //   const [events, setEvents] = useState([]);
    //   const [days, setDays] = useState([]);

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
            <div className="hidden md:flex md:flex-row w-full">
                {/* Left col */}
                <div className="w-full md:w-9/12 pr-4 mb-2 md:mb-0">
                    <div className="flex bg-[#120C38] pt-6 rounded-lg mb-6 shadow-md h-[20vh] bg-pattern greetings text-white" style={{
                        backgroundRepeat: "repeat",
                    }}>
                        Greetings
                    </div>
                    {/* Graphic and leader flex box */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 h-[30vh]">
                        <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-full relative productivity">
                            productivity
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-full leaders">
                            leaders
                        </div>
                    </div>
                    <div className="bg-white w-[100%] h-[33vh] flex flex-col rounded-lg shadow-md justify-between border border-[#8a48e6] students-success">
                        students success
                    </div>
                </div>
                {/* Right col */}
                <div className="w-full md:w-3/12 ml-auto mr-4">
                    <div className="bg-white p-4 rounded-lg mb-6 shadow-md h-[28vh] justify-center items-start gap-[22.67px] overflow-hidden schedule-mobile-hidden">
                        schedule
                    </div>    
                    <div className="bg-white p-4 rounded-lg mb-6 shadow-md h-[30vh] overflow-y-auto ">
                        latest activity
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md h-[25vh] overflow-y-auto events">
                        nearest events
                    </div>
                </div>
            </div>
        </div>
    );
}