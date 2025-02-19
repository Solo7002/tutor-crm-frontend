import React, { useState,useEffect } from "react";
import Navbar from "../../layouts/Navbar";
import TaskButton from '../../components/TaskButton/TaskButton';
import { HomeTaskCardFull, HomeTaskCard } from '../../components/HomeCard/Hometask-card';
import   "./HometaskStudent.css";
import axios from 'axios';
import { DateTime } from "luxon";

const formatDate = (date) => 
  DateTime.fromISO(date, { zone: "utc" }).toFormat("dd.MM.yyyy");

const HometaskStudent = () => {
  const [selectedButton, setSelectedButton] = useState(0);

  const handleButtonClick = (index) => {
    setSelectedButton(index);
  };

  const buttons = [
    { text: 'До виконання', icon: 'M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01', count: 5 },
    { text: 'На перевірці', icon: 'M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z', count: 3 },
    { text: 'Виконано', icon: 'M5 12L10 17L20 7', count: 2 }];
  const [newHomeTasks, setNewHomeTasks] = useState([]);
  const [pendingHomeTasks, setPendingHomeTasks] = useState([]);
  const [donegHomeTasks, setDoneHomeTasks] = useState([]);

    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcnRlbXJvZ296YW5AZ21haWwuY29tIiwiaWF0IjoxNzM5OTc0NDM0LCJleHAiOjE3Mzk5NzgwMzR9.NEN1Ydv8FKj0rrKEpnRivWTnMoZwVQmEoc3N2AQJDws";
  const studentId=2;
  const fetchTasksByStatus = async (url, setTasks, statusType) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tasks = response.data.data;
  
      const tasksWithStatus = await Promise.all(
        tasks.map(async (task) => {
          const deadlineDate = new Date(task.DeadlineDate);
          const now = new Date();
          let teacherData = "";
          let homeTaskDetails = {};
          let subjectName = "";
          try {
            const teacherResponse = await axios.get(
              `http://localhost:4000/api/teachers/hometaskTeacher/${task.HomeTaskId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            teacherData = teacherResponse.data;
          } catch (error) {
            console.log(
              `Ошибка при получении данных о преподавателе (ID: ${task.HomeTaskId}):`,
              error
            );
          }
          try {
            const subjectResponse = await axios.get(
              `http://localhost:4000/api/subjects/hometaskSubjectName/${task.HomeTaskId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
           console.log(subjectResponse);
           subjectName=subjectResponse.data.SubjectName;
           
          } catch (error) {
            console.log(
              `Ошибка при получении данных о предмете (ID: ${task.HomeTaskId}):`,
              error
            );
          }
         
          if (statusType === "pending" || statusType === "done") {
            try {
              console.log(task);
              const homeTaskResponse = await axios.get(
                `http://localhost:4000/api/hometasks/${task.HomeTaskId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              homeTaskDetails = homeTaskResponse.data;
            } catch (error) {
              console.log(
                `Ошибка при получении данных о домашнем задании (ID: ${task.HomeTaskId}):`,
                error
              );
            }
          }
          console.log("homeTaskDetails:", homeTaskDetails);
        
          let status;
          if (statusType === "new") {
            status = deadlineDate < now ? "overdue" : "default";
          } else if (statusType === "pending") {
            status = "pending";
          } else if (statusType === "done") {
            status = "done";
          }
         
          return {
            ...task, ...homeTaskDetails,
            status,
            subject: subjectName,
            title: homeTaskDetails.HomeTaskHeader || task.HomeTaskHeader,
            teacher: `${teacherData.FirstName} ${teacherData.LastName}`,
            ImageFilePath: homeTaskDetails.ImageFilePath || task.ImageFilePath,
            DeadlineDate: homeTaskDetails.DeadlineDate || task.DeadlineDate,
            StartDate: task.DoneDate || task.StartDate,
            Mark: homeTaskDetails.Mark || task.Mark,
            MaxMark: homeTaskDetails.MaxMark || task.Mark
          };
        })
      );
      setTasks([...tasksWithStatus]);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setTasks([]);
    }
  };
  
  useEffect(() => {
    fetchTasksByStatus(
      `http://localhost:4000/api/hometasks/newHometask/${studentId}`,
      setNewHomeTasks,
      "new"
    );
    fetchTasksByStatus(
      `http://localhost:4000/api/donehometasks/pendingHometask/${studentId}`,
      setPendingHomeTasks,
      "pending"
    );
    fetchTasksByStatus(
      `http://localhost:4000/api/donehometasks/doneHometask/${studentId}`,
      setDoneHomeTasks,
      "done"
    );


  
   
  }, [token]);
  


  return (
    <Navbar>
      <main>
        <div className="hometask p-6">
          <h1 className="text-2xl font-bold">Hometask Student</h1>
          <div className="nav flex items-center justify-between">
            <div className="h-12 flex items-center gap-2 overflow-hidden">
              {buttons.map((button, index) => (
                <TaskButton
                  key={index}
                  text={button.text}
                  icon={button.icon}
                  count={button.count}
                  isSelected={selectedButton === index}
                  onClick={() => handleButtonClick(index)}
                />
              ))}
            </div>
          </div>
          {/* Контейнер для карточек */}
          <div className= "card-container ">
          {newHomeTasks.map((task) => (
        <HomeTaskCardFull
        key={task.id}
        status={task.status}
        subject={task.subject}
        title={task.HomeTaskHeader}
        issuedDate={formatDate(task.StartDate)}
        dueDate={formatDate(task.DeadlineDate)}
        teacher={task.teacher}
        photoSrc={task.ImageFilePath}
       
      />
      ))}  
      {pendingHomeTasks.map((task) => (
        <HomeTaskCardFull
        key={task.id}
        status={task.status}
        subject={task.subject}
        title={task.HomeTaskHeader}
        issuedDate={formatDate(task.StartDate)}
        dueDate={formatDate(task.DeadlineDate)}
        teacher={task.teacher}
        photoSrc={task.ImageFilePath}
       
      />
      ))} 
       {donegHomeTasks.map((task) => (
        <HomeTaskCardFull
       
        status={task.status}
        subject={task.subject}
        title={task.HomeTaskHeader}
        issuedDate={formatDate(task.StartDate)}
        dueDate={formatDate(task.DeadlineDate)}
        teacher={task.teacher}
        photoSrc={task.ImageFilePath}
        mark={task.Mark}
        maxmark={task.MaxMark}
      />
      ))}         
      </div>
        </div>
      </main>
    </Navbar>
  );
};

export default HometaskStudent;