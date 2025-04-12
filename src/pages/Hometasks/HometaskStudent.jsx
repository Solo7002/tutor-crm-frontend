import React, { useState, useEffect, useMemo, useCallback } from "react";
import TaskButton from '../../components/TaskButton/TaskButton';
import { HomeTaskCardFull, HomeTaskCard } from './components/HomeCard/Hometask-card';
import "./HometaskStudent.css";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import SearchButton from '../Materials/components/SearchButton';
import ToggleSwitch from '../Materials/components/ToggleSwitch';
import Dropdown from '../../components/Dropdown/Dropdown';
import SortDropdown from '../Materials/components/SortDropdown';
import { HometaskModal } from "./components/HometaskModal/HometaskModal";
import { formatDate } from "../../functions/formatDate";

// Simple debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

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
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("Усі предмети");
  const [userId, setUserId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [token, setToken] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false); // New state for switching

  useEffect(() => {
    const tok = sessionStorage.getItem("token");
    setToken(tok); // Fixed: Use tok instead of token
    if (tok) {
      try {
        const decoded = jwtDecode(tok);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Ошибка при расшифровке токена:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:4000/api/students/search-by-user-id/${userId}`)
        .then((response) => {
          if (response.data.success) {
            setStudentId(response.data.data[0].StudentId);
          }
        })
        .catch((error) => {
          console.error("Ошибка при получении studentId:", error);
        });
    }
  }, [userId]);

  const buttons = [
    {
      text: 'До виконання',
      icon: 'M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01',
      count: newHomeTasks.length,
    },
    {
      text: 'На перевірці',
      icon: 'M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z',
      count: pendingHomeTasks.length,
    },
    { text: 'Виконано', icon: 'M5 12L10 17L20 7', count: doneHomeTasks.length },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const subjectsResponse = await fetchSubjectsByStudentId(studentId);
        setSubjects(subjectsResponse);

        await Promise.all([
          fetchTasksByStatus(`http://localhost:4000/api/hometasks/newHometask/${studentId}`, setNewHomeTasks, "new"),
          fetchTasksByStatus(`http://localhost:4000/api/donehometasks/pendingHometask/${studentId}`, setPendingHomeTasks, "pending"),
          fetchTasksByStatus(`http://localhost:4000/api/donehometasks/doneHometask/${studentId}`, setDoneHomeTasks, "done"),
        ]);
      } catch (error) {
        console.error("Ошибка при первоначальной загрузке данных:", error);
      }
    };

    if (studentId) {
      fetchInitialData();
    }
  }, [studentId]);

  const filterTasksBySubject = useCallback((tasks, subject) => {
    if (subject === "Усі предмети") return tasks;
    return tasks.filter((task) => task.subject === subject);
  }, []);

  useEffect(() => {
    setNewHomeTasks(filterTasksBySubject(originalNewHomeTasks, selectedSubject));
    setPendingHomeTasks(filterTasksBySubject(originalPendingHomeTasks, selectedSubject));
    setDoneHomeTasks(filterTasksBySubject(originalDoneHomeTasks, selectedSubject));
  }, [selectedSubject, originalNewHomeTasks, originalPendingHomeTasks, originalDoneHomeTasks, filterTasksBySubject]);

  const fetchSubjectsByStudentId = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/subjects/subjectsByStudentId/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении предметов:", error);
      return [];
    }
  };

  const fetchTasksByStatus = async (url, setTasks, statusType) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
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
            console.log(`Ошибка при получении данных о преподавателе (ID: ${task.HomeTaskId}):`, error);
          }

          try {
            const subjectResponse = await axios.get(
              `http://localhost:4000/api/subjects/hometaskSubjectName/${task.HomeTaskId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            subjectName = subjectResponse.data.SubjectName;
          } catch (error) {
            console.log(`Ошибка при получении данных о предмете (ID: ${task.HomeTaskId}):`, error);
          }

          if (statusType === "pending" || statusType === "done") {
            try {
              const homeTaskResponse = await axios.get(
                `http://localhost:4000/api/hometasks/${task.HomeTaskId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              homeTaskDetails = homeTaskResponse.data;
            } catch (error) {
              console.log(`Ошибка при получении данных о домашнем задании (ID: ${task.HomeTaskId}):`, error);
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
            ...task,
            ...homeTaskDetails,
            status,
            subject: subjectName,
            title: homeTaskDetails.HomeTaskHeader || task.HomeTaskHeader,
            teacher: `${teacherData.FirstName} ${teacherData.LastName}`,
            ImageFilePath: homeTaskDetails.ImageFilePath || task.ImageFilePath,
            DeadlineDate: homeTaskDetails.DeadlineDate || task.DeadlineDate,
            StartDate: task.DoneDate || task.StartDate,
            Mark: homeTaskDetails.Mark || task.Mark,
            MaxMark: homeTaskDetails.MaxMark || task.MaxMark,
          };
        })
      );

      if (statusType === "new") {
        setOriginalNewHomeTasks(tasksWithStatus);
        setNewHomeTasks(tasksWithStatus);
      } else if (statusType === "pending") {
        setOriginalPendingHomeTasks(tasksWithStatus);
        setPendingHomeTasks(tasksWithStatus);
      } else if (statusType === "done") {
        setOriginalDoneHomeTasks(tasksWithStatus);
        setDoneHomeTasks(tasksWithStatus);
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setTasks([]);
    }
  };

  const handleSearch = useCallback((query) => {
    if (query === "") {
      setNewHomeTasks(filterTasksBySubject(originalNewHomeTasks, selectedSubject));
      setPendingHomeTasks(filterTasksBySubject(originalPendingHomeTasks, selectedSubject));
      setDoneHomeTasks(filterTasksBySubject(originalDoneHomeTasks, selectedSubject));
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

      setNewHomeTasks(filterTasksBySubject(filteredNewTasks, selectedSubject));
      setPendingHomeTasks(filterTasksBySubject(filteredPendingTasks, selectedSubject));
      setDoneHomeTasks(filterTasksBySubject(filteredDoneTasks, selectedSubject));
    }
  }, [selectedSubject, originalNewHomeTasks, originalPendingHomeTasks, originalDoneHomeTasks, filterTasksBySubject]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const loadDataInHometaskModal = async (status, id) => {
    try {
      setDataLoaded(false);
      let hometask, hometaskDone, subjectName, hometaskFile, hometaskDoneFile;

      const hometaskResponse = await axios.get(`http://localhost:4000/api/hometasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      hometask = hometaskResponse.data;

      if (status === "done" || status === "pending") {
        const doneResponse = await axios.get(
          `http://localhost:4000/api/doneHometasks/checkedHomeTasks/${studentId}/${hometask.HomeTaskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        hometaskDone = doneResponse.data.data[0];
        setHometaskDoneInModal(hometaskDone);

        const doneFilesResponse = await axios.get(
          `http://localhost:4000/api/doneHomeTaskFiles/getByDoneHomeTask/${hometaskDone.DoneHomeTaskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        hometaskDoneFile = doneFilesResponse.data;
        setHometaskDoneFileInModal(hometaskDoneFile);
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
      hometaskFile = fileResponse.data.map((file) => {
        const fileName = file.FileName;
        const format = fileName.split('.').pop().toUpperCase();
        return { ...file, format };
      });

      setHometaskInModal({ ...hometask, subjectName });
      setHometaskFile(hometaskFile);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error parsing data in server:", error.message);
    } finally {
      setDataLoaded(true);
    }
  };

  const handleOpenModal = (id) => {
    loadDataInHometaskModal(status, id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Debounced button click handler
  const handleButtonClick = useCallback(
    debounce((index) => {
      setIsSwitching(true);  
      setSelectedButton(index);
    
      switch (index) {
        case 0:
          setStatus("default");
          break;
        case 1:
          setStatus("pending");
          break;
        case 2:
          setStatus("done");
          break;
        default:
          setStatus("default");
          break;
      }
       
      setTimeout(() => setIsSwitching(false), 100);
    }, 100),
    []
  );

  const sortTasks = useCallback((tasks, sortOption) => {
    switch (sortOption) {
      case "Спочатку нові":
        return [...tasks].sort((a, b) => new Date(b.StartDate || b.DoneDate) - new Date(a.StartDate || a.DoneDate));
      case "Спочатку старі":
        return [...tasks].sort((a, b) => new Date(a.StartDate || a.DoneDate) - new Date(b.StartDate || a.DoneDate));
      case "За алфавітом":
        return [...tasks].sort((a, b) => a.HomeTaskHeader.localeCompare(b.HomeTaskHeader));
      default:
        return tasks;
    }
  }, []);

  const sortAllTasks = useCallback((option) => {
    setNewHomeTasks((prev) => sortTasks(prev, option));
    setPendingHomeTasks((prev) => sortTasks(prev, option));
    setDoneHomeTasks((prev) => sortTasks(prev, option));
  }, [sortTasks]);

  // Memoize the selected task list
  const selectedTasks = useMemo(() => {
    if (isSwitching) return []; // Return empty array during switching to show loading
    return selectedButton === 0 ? newHomeTasks : selectedButton === 1 ? pendingHomeTasks : doneHomeTasks;
  }, [selectedButton, newHomeTasks, pendingHomeTasks, doneHomeTasks, isSwitching]);

  return (
    <div>
      {isModalOpen && (
        <div className="hometask-modal" tabIndex={-1} ref={(el) => el?.focus()}>
          <div className="hometask-modal-content">
            {!isDataLoaded ? (
              <div className="modal-loading">Завантаження...</div>
            ) : (
              <HometaskModal
                onClose={handleCloseModal}
                status={status}
                token={token}
                hometaskDoneFiles={hometaskDoneFileInModal}
                hometask={hometaskInModal}
                hometaskDone={hometaskDoneInModal}
                hometaskFiles={hometaskFile}
                studentId={studentId}
              />
            )}
          </div>
        </div>
      )}
      <main>
        <div className="hometask p-6">
          <div className="nav flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="h-12 flex items-center gap-2 overflow-x-auto w-full sm:w-auto px-2 sm:px-4 no-scrollbar">
              {buttons.map((button, index) => (
                <TaskButton
                  key={index}
                  text={button.text}
                  icon={button.icon}
                  count={button.count}
                  isSelected={selectedButton === index}
                  onClick={() => handleButtonClick(index)}
                  className="flex-shrink-0"
                />
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SearchButton
                onSearchClick={() => handleSearch(searchQuery)}
                value={searchQuery}
                setValue={setSearchQuery}
              />
              <div className="flex items-center">
                <div data-svg-wrapper>
                  <svg
                    width="40"
                    height="40"
                    className="sm:w-12 sm:h-12"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="48" height="48" rx="24" fill="white" />
                    <path
                      d="M13.3334 13.3333H34.6667V16.2293C34.6666 16.9365 34.3855 17.6147 33.8854 18.1147L28 24V33.3333L20 36V24.6667L14.0267 18.096C13.5806 17.6052 13.3334 16.9659 13.3334 16.3027V13.3333Z"
                      stroke="#120C38"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons-box flex flex-col sm:flex-row gap-2">
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
                onSelect={(option) => sortAllTasks(option)}
              />
            </div>
          </div>
          <div className="card-container grid gap-3 justify-center items-center p-4 lg:grid-cols-[repeat(auto-fit,minmax(420px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))] sm:grid-cols-1 xs:grid-cols-1">
            {isSwitching ? (
              <div className="col-span-full text-center">Завантаження...</div>
            ) : (
              selectedTasks.map((task) => (
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
                    key={task.HomeTaskId}
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
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HometaskStudent;