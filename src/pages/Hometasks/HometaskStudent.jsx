import React, { useState, useEffect } from "react";
import Navbar from "../../layouts/Navbar";
import TaskButton from '../../components/TaskButton/TaskButton';
import { HomeTaskCardFull, HomeTaskCard } from '../../components/HomeCard/Hometask-card';
import "./HometaskStudent.css";
import axios from 'axios';

import SearchButton from '../Materials/components/SearchButton';
import ToggleSwitch from '../Materials/components/ToggleSwitch';
import Dropdown from '../../components/Dropdown/Dropdown';
import SortDropdown from '../Materials/components/SortDropdown';
import { HometaskModal } from "../../components/HometaskModal/HometaskModal";
import { formatDate } from "../../functions/formatDate";

const HometaskStudent = () => {
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);
  const [isBlock, setIsBlock] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("default");
  const [hometaskFile, setHometaskFile] = useState([]);
  const [hometaskInModal, setHometaskInModal] = useState(null);
  const [hometaskDoneInModal, setHometaskDoneInModal] = useState(null);
  const [hometaskDoneFileInModal, setHometaskDoneFileInModal] = useState(null);
  const [newHomeTasks, setNewHomeTasks] = useState([]);
  const [pendingHomeTasks, setPendingHomeTasks] = useState([]);
  const [doneHomeTasks, setDoneHomeTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalNewHomeTasks, setOriginalNewHomeTasks] = useState([]);
  const [originalPendingHomeTasks, setOriginalPendingHomeTasks] = useState([]);
  const [originalDoneHomeTasks, setOriginalDoneHomeTasks] = useState([]);
  const buttons = [
    { text: 'До виконання', icon: 'M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01', count: newHomeTasks.length },
    { text: 'На перевірці', icon: 'M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z', count: pendingHomeTasks.length },
    { text: 'Виконано', icon: 'M5 12L10 17L20 7', count: doneHomeTasks.length }];
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("Усі предмети");

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcnRlbXJvZ296YW5AZ21haWwuY29tIiwiaWF0IjoxNzQwMzk2MjExLCJleHAiOjE3NDAzOTk4MTF9.duZ-ZWFrSgGUgL0Krq7yP_TlgJE1Iia5nvT5buOsxlk";
  const studentId = 2;


  // Загрузка предметов при монтировании компонента
  useEffect(() => {
    const loadSubjects = async () => {
      const subjects = await fetchSubjectsByStudentId(studentId);
      setSubjects(subjects);
    };

    loadSubjects();
  }, [studentId]);
  const filterTasksBySubject = (tasks, subject) => {
    if (subject === "Усі предмети") {
      return tasks;
    }
    return tasks.filter(task => task.subject === subject); // Фильтруем задачи по предмету
  };

  // При изменении выбранного предмета
  useEffect(() => {
    const filteredNewTasks = filterTasksBySubject(originalNewHomeTasks, selectedSubject);
    const filteredPendingTasks = filterTasksBySubject(originalPendingHomeTasks, selectedSubject);
    const filteredDoneTasks = filterTasksBySubject(originalDoneHomeTasks, selectedSubject);

    setNewHomeTasks(filteredNewTasks);
    setPendingHomeTasks(filteredPendingTasks);
    setDoneHomeTasks(filteredDoneTasks);
  }, [selectedSubject, originalNewHomeTasks, originalPendingHomeTasks, originalDoneHomeTasks]);
  const fetchSubjectsByStudentId = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/subjects/subjectsByStudentId/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Предположим, что данные возвращаются в формате [{ SubjectId, SubjectName }]
    } catch (error) {
      console.error("Ошибка при получении предметов:", error);
      return [];
    }
  };
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
            subjectName = subjectResponse.data.SubjectName;

          } catch (error) {
            console.log(
              `Ошибка при получении данных о предмете (ID: ${task.HomeTaskId}):`,
              error
            );
          }

          if (statusType === "pending" || statusType === "done") {
            try {
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
      if (statusType === "new") {
        setOriginalNewHomeTasks(tasksWithStatus);
      } else if (statusType === "pending") {
        setOriginalPendingHomeTasks(tasksWithStatus);
      } else if (statusType === "done") {
        setOriginalDoneHomeTasks(tasksWithStatus);
      }
      setTasks([...tasksWithStatus]);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setTasks([]);
    }
  };
  const handleSearch = (query) => {
    if (query === "") {

      setNewHomeTasks(originalNewHomeTasks);
      setPendingHomeTasks(originalPendingHomeTasks);
      setDoneHomeTasks(originalDoneHomeTasks);
    } else {

      const filteredNewTasks = originalNewHomeTasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
      const filteredPendingTasks = originalPendingHomeTasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
      const filteredDoneTasks = originalDoneHomeTasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );

      setNewHomeTasks(filteredNewTasks);
      setPendingHomeTasks(filteredPendingTasks);
      setDoneHomeTasks(filteredDoneTasks);
    }
  };
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);
  const loadDataInHometaskModal = async (status, id) => {
    try {
      setDataLoaded(false);
      console.log(`----------------------StartloadDataInHometaskModal-------------------------`);

      let hometask, hometaskDone, subjectName, hometaskFile, hometaskDoneFile;
      const hometaskResponse = await axios.get(`http://localhost:4000/api/hometasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      hometask = hometaskResponse.data;

      if (status === "done" || status === "pending") {
        const doneResponse = await axios.get(`http://localhost:4000/api/doneHometasks/checkedHomeTasks/${studentId}/${hometask.HomeTaskId}`, { headers: { Authorization: `Bearer ${token}` } });
        hometaskDone = doneResponse.data.data[0];
        setHometaskDoneInModal(hometaskDone);
        console.log(hometaskDone);

        const doneFilesResponse = await axios.get(`http://localhost:4000/api/doneHomeTaskFiles/getByDoneHomeTask/${hometaskDone.DoneHomeTaskId}`, { headers: { Authorization: `Bearer ${token}` } });
        hometaskDoneFile = doneFilesResponse.data;
        console.log(hometaskDoneFile);
        setHometaskDoneFileInModal(hometaskDoneFile);
      }

      if (!hometask) {
        throw new Error("Hometask data is undefined");
      }

      const subjectResponse = await axios.get(
        `http://localhost:4000/api/subjects/hometaskSubjectName/${hometask.HomeTaskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      subjectName = subjectResponse.data.SubjectName;

      const fileResponse = await axios.get(
        `http://localhost:4000/api/hometaskFiles/getFilebyHometaskId/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      hometaskFile = fileResponse.data;
      hometaskFile = hometaskFile.map(file => {

        const fileName = file.FileName;
        const format = fileName.split('.').pop().toUpperCase();
        return {
          ...file,
          format,
        };
      });



      const hometaskWithSubject = { ...hometask, subjectName };


      setHometaskInModal(hometaskWithSubject);
      setHometaskFile(hometaskFile);


      setIsModalOpen(true);
      console.log(`----------------------EndloadDataInHometaskModal-------------------------`);
    } catch (error) {
      console.log("Error parsing data in server:", error.message);
    } finally {
      setDataLoaded(true);
    }
  };

  const handleOpenModal = (id) => {
    loadDataInHometaskModal(status, id);

  };
  const handleCloseModal = () => setIsModalOpen(false);

  const getStatus = (index) => {

    setSearchQuery('');
    switch (index) {

      case 1: setStatus("pending"); break;
      case 2: setStatus("done"); break;
      default: setStatus("default"); break;
    }
  }
  const handleButtonClick = (index) => {
    getStatus(index);
    setSelectedButton(index);

  };
  const sortTasks = (tasks, sortOption) => {
    switch (sortOption) {
      case "Спочатку нові":
        // Сортировка по дате (новые сначала)
        return [...tasks].sort((a, b) => new Date(b.StartDate || b.DoneDate) - new Date(a.StartDate || a.DoneDate));
      case "Спочатку старі":
        // Сортировка по дате (старые сначала)
        return [...tasks].sort((a, b) => new Date(a.StartDate || a.DoneDate) - new Date(b.StartDate || b.DoneDate));
      case "За алфавітом":
        // Сортировка по заголовку (по алфавиту)
        return [...tasks].sort((a, b) => a.HomeTaskHeader.localeCompare(b.HomeTaskHeader));
      default:
        // По умолчанию возвращаем исходный массив
        return tasks;
    }
  };
  const sortAllTasks = (option) => {
    setNewHomeTasks(sortTasks(newHomeTasks, option));
    setPendingHomeTasks(sortTasks(pendingHomeTasks, option));
    setDoneHomeTasks(sortTasks(doneHomeTasks, option));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (status === "default") {
        await fetchTasksByStatus(
          `http://localhost:4000/api/hometasks/newHometask/${studentId}`,
          setNewHomeTasks,
          "new"
        );
      } else if (status === "pending") {
        await fetchTasksByStatus(
          `http://localhost:4000/api/donehometasks/pendingHometask/${studentId}`,
          setPendingHomeTasks,
          "pending"
        );
      } else if (status === "done") {
        await fetchTasksByStatus(
          `http://localhost:4000/api/donehometasks/doneHometask/${studentId}`,
          setDoneHomeTasks,
          "done"
        );
      }
    };

    fetchData();
  }, [status])



  return (
    <div>
      {isModalOpen && isDataLoaded && <HometaskModal onClose={handleCloseModal} status={status} token={token} hometaskDoneFiles={hometaskDoneFileInModal} hometask={hometaskInModal} hometaskDone={hometaskDoneInModal} hometaskFiles={hometaskFile} studentId={studentId} />}
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
            <div className="gap-2 flex">
              <SearchButton
                onSearchClick={() => handleSearch(searchQuery)}
                value={searchQuery}
                setValue={setSearchQuery}
              />
              <div className="items-center gap-2 flex">
                <div data-svg-wrapper>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="24" fill="white" />
                    <path d="M13.3334 13.3333H34.6667V16.2293C34.6666 16.9365 34.3855 17.6147 33.8854 18.1147L28 24V33.3333L20 36V24.6667L14.0267 18.096C13.5806 17.6052 13.3334 16.9659 13.3334 16.3027V13.3333Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className='buttons-box'>
            <div className="gap-2 flex">
              <ToggleSwitch isOn={isBlock} setIsOn={setIsBlock} />
              <Dropdown
                options={subjects}
                onSelectSubject={(subject) => setSelectedSubject(subject)}
              />
            </div>
            <div className="gap-2 flex">
              <SortDropdown
                options={["Спочатку нові", "Спочатку старі", "За алфавітом"]}
                onSelect={(option) => {
                  sortAllTasks(option);
                }}
              />
            </div>
          </div>
          {/* Контейнер для карточек */}
          <div className="card-container">
            {(selectedButton === 0 ? newHomeTasks : selectedButton === 1 ? pendingHomeTasks : doneHomeTasks).map((task) => (
              isBlock ? (
                <HomeTaskCardFull
                  key={task.HomeTaskId}
                  status={task.status}
                  subject={task.subject}
                  title={task.HomeTaskHeader}
                  issuedDate={formatDate(task.StartDate)}
                  dueDate={formatDate(task.DeadlineDate)}
                  teacher={task.teacher}
                  mark={task.Mark}
                  maxmark={task.MaxMark}
                  photoSrc={task.ImageFilePath}
                  onClick={() => handleOpenModal(task.HomeTaskId)}
                />
              ) : (
                <HomeTaskCard
                  key={task.id}
                  status={task.status}
                  subject={task.subject}
                  title={task.HomeTaskHeader}
                  issuedDate={formatDate(task.StartDate)}
                  dueDate={formatDate(task.DeadlineDate)}
                  teacher={task.teacher}
                  mark={task.Mark}
                  maxmark={task.MaxMark}
                  onClick={() => handleOpenModal(task.HomeTaskId)}
                />

              )
            ))}
          </div>
        </div>
        <div>
        </div>
      </main>
    </div>
  );
};

export default HometaskStudent;