import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import TaskButton from '../../components/TaskButton/TaskButton';
import { HomeTaskCardFull, HomeTaskCard } from './components/HomeCard/Hometask-card';
import "./HometaskStudent.css";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import ToggleSwitch from '../Materials/components/ToggleSwitch';
import SearchButton from '../Materials/components/SearchButton';
import Dropdown from '../../components/Dropdown/Dropdown';
import SortDropdown from '../Materials/components/SortDropdown';
import { HometaskModal } from "./components/HometaskModal/HometaskModal";
import { formatDate } from "../../functions/formatDate";
import { toast } from 'react-toastify';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const HometaskStudent = () => {
  const { t } = useTranslation();
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
  const [selectedSubject, setSelectedSubject] = useState(t('HometaskStudent.components.page.Filters.AllSubjects'));
  const [userId, setUserId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [token, setToken] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tok = sessionStorage.getItem("token");
    setToken(tok);
    if (tok) {
      try {
        const decoded = jwtDecode(tok);
        setUserId(decoded.id);
      } catch (error) {
        toast.error(t('HometaskStudent.components.page.Errors.TokenDecode'), {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    }
  }, [t]);

  useEffect(() => {
    if (userId && token) {
      axios
        .get(`${process.env.REACT_APP_BASE_API_URL}/api/students/search-by-user-id/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            setStudentId(response.data.data[0].StudentId);
          }
        })
        .catch((error) => {
          toast.error(t('HometaskStudent.components.page.Errors.FetchStudentId'), {
            position: "bottom-right",
            autoClose: 5000,
          });
        });
    }
  }, [userId, token, t]);

  const buttons = [
    {
      text: t('HometaskStudent.components.page.Tabs.ToDo'),
      icon: 'M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01',
      count: newHomeTasks.length,
    },
    {
      text: t('HometaskStudent.components.page.Tabs.Pending'),
      icon: 'M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z',
      count: pendingHomeTasks.length,
    },
    {
      text: t('HometaskStudent.components.page.Tabs.Done'),
      icon: 'M5 12L10 17L20 7',
      count: doneHomeTasks.length,
    },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const subjectsResponse = await fetchSubjectsByStudentId(studentId);
        setSubjects(subjectsResponse);

        await Promise.all([
          fetchTasksByStatus(`${process.env.REACT_APP_BASE_API_URL}/api/hometasks/newHometask/${studentId}`, setNewHomeTasks, "new"),
          fetchTasksByStatus(`${process.env.REACT_APP_BASE_API_URL}/api/donehometasks/pendingHometask/${studentId}`, setPendingHomeTasks, "pending"),
          fetchTasksByStatus(`${process.env.REACT_APP_BASE_API_URL}/api/donehometasks/doneHometask/${studentId}`, setDoneHomeTasks, "done"),
        ]);
      } catch (error) {
        toast.error(t('HometaskStudent.components.page.Errors.FetchInitialData'), {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    };

    if (studentId) {
      fetchInitialData();
    }
  }, [studentId, t]);

  const filterTasksBySubject = useCallback((tasks, subject) => {
    if (subject === t('HometaskStudent.components.page.Filters.AllSubjects')) return tasks;
    return tasks.filter((task) => task.subject === subject);
  }, [t]);

  useEffect(() => {
    setNewHomeTasks(filterTasksBySubject(originalNewHomeTasks, selectedSubject));
    setPendingHomeTasks(filterTasksBySubject(originalPendingHomeTasks, selectedSubject));
    setDoneHomeTasks(filterTasksBySubject(originalDoneHomeTasks, selectedSubject));
  }, [selectedSubject, originalNewHomeTasks, originalPendingHomeTasks, originalDoneHomeTasks, filterTasksBySubject]);

  const fetchSubjectsByStudentId = async (studentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/subjects/subjectsByStudentId/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error(t('HometaskStudent.components.page.Errors.FetchSubjects'), {
        position: "bottom-right",
        autoClose: 5000,
      });
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
              `${process.env.REACT_APP_BASE_API_URL}/api/teachers/hometaskTeacher/${task.HomeTaskId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            teacherData = teacherResponse.data;
          } catch (error) {
            toast.error(t('HometaskStudent.components.page.Errors.FetchTeacher', { id: task.HomeTaskId }), {
              position: "bottom-right",
              autoClose: 5000,
            });
          }

          try {
            const subjectResponse = await axios.get(
              `${process.env.REACT_APP_BASE_API_URL}/api/subjects/hometaskSubjectName/${task.HomeTaskId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            subjectName = subjectResponse.data.SubjectName;
          } catch (error) {
            toast.error(t('HometaskStudent.components.page.Errors.FetchSubject', { id: task.HomeTaskId }), {
              position: "bottom-right",
              autoClose: 5000,
            });
          }

          if (statusType === "pending" || statusType === "done") {
            try {
              const homeTaskResponse = await axios.get(
                `${process.env.REACT_APP_BASE_API_URL}/api/hometasks/${task.HomeTaskId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              homeTaskDetails = homeTaskResponse.data;
            } catch (error) {
              toast.error(t('HometaskStudent.components.page.Errors.FetchHometask', { id: task.HomeTaskId }), {
              position: "bottom-right",
              autoClose: 5000,
              });
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
      toast.error(t('HometaskStudent.components.page.Errors.FetchTasks'), {
        position: "bottom-right",
        autoClose: 5000,
      });
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

      const hometaskResponse = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/hometasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      hometask = hometaskResponse.data;

      if (status === "done" || status === "pending") {
        const doneResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/doneHometasks/checkedHomeTasks/${studentId}/${hometask.HomeTaskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        hometaskDone = doneResponse.data.data[0];
        setHometaskDoneInModal(hometaskDone);

        const doneFilesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/doneHomeTaskFiles/getByDoneHomeTask/${hometaskDone.DoneHomeTaskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        hometaskDoneFile = doneFilesResponse.data;
        setHometaskDoneFileInModal(hometaskDoneFile);
      }

      const subjectResponse = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/subjects/hometaskSubjectName/${hometask.HomeTaskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      subjectName = subjectResponse.data.SubjectName;

      const fileResponse = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/hometaskFiles/getFilebyHometaskId/${id}`,
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
      toast.error(t('HometaskStudent.components.page.Errors.ParseData'), {
        position: "bottom-right",
        autoClose: 5000,
      });
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

  const refreshTasks = useCallback(async () => {
    try {
      await Promise.all([
        fetchTasksByStatus(`${process.env.REACT_APP_BASE_API_URL}/api/hometasks/newHometask/${studentId}`, setNewHomeTasks, "new"),
        fetchTasksByStatus(`${process.env.REACT_APP_BASE_API_URL}/api/donehometasks/pendingHometask/${studentId}`, setPendingHomeTasks, "pending"),
      ]);
    } catch (error) {
      toast.error(t('HometaskStudent.components.page.Errors.RefreshTasks'), {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  }, [studentId, token, t]);

  const sendHometask = useCallback(async (selectedFiles) => {
    setIsSubmitting(true);
  
    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
  
          const uploadResponse = await axios.post(
            `${process.env.REACT_APP_BASE_API_URL}/api/files/uploadAndReturnLink`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          const fileUrl = uploadResponse.data?.fileUrl;
  
          if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('http')) {
            throw new Error(t('HometaskStudent.components.page.Errors.UploadFile', { fileName: file.name }));
          }
  
          return {
            name: file.name,
            url: fileUrl,
          };
        })
      );
  
      if (uploadedFiles.length !== selectedFiles.length) {
        throw new Error(t('HometaskStudent.components.page.Errors.IncompleteUpload'));
      }
  
      const createResponse = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/api/doneHometasks`,
        {
          HomeTaskId: hometaskInModal.HomeTaskId,
          StudentId: studentId,
          DoneDate: new Date().toISOString(),
          Mark: -1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const doneHometaskId = createResponse.data.DoneHomeTaskId;
  
      await Promise.all(
        uploadedFiles.map((file) =>
          axios.post(
            `${process.env.REACT_APP_BASE_API_URL}/api/doneHometaskFiles/`,
            {
              DoneHomeTaskId: doneHometaskId,
              FileName: file.name,
              FilePath: file.url,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
  
      toast.success(
        <div>
          <p>{t('HometaskStudent.components.page.Messages.SendSuccess')}</p>
          <p>{t('HometaskStudent.components.page.Messages.SendSuccessTitle', { title: hometaskInModal.HomeTaskHeader })}</p>
        </div>,
        { position: 'bottom-right', autoClose: 5000 }
      );
  
      await refreshTasks();
      setSelectedButton(1);
      setStatus('pending');
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.message || t('HometaskStudent.components.page.Messages.SendError'),
        {
          position: 'bottom-right',
          autoClose: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [hometaskInModal, studentId, token, refreshTasks, t]);

  const cancelHometask = useCallback(async () => {
    if (hometaskDoneInModal) {
      setIsSubmitting(true);
      try {
        await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/doneHometasks/${hometaskDoneInModal.DoneHomeTaskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success(
          <div>
            <p>{t('HometaskStudent.components.page.Messages.CancelSuccess')}</p>
            <p>{t('HometaskStudent.components.page.Messages.CancelSuccessTitle', { title: hometaskInModal.HomeTaskHeader })}</p>
          </div>,
          {
            position: "bottom-right",
            autoClose: 5000
          }
        );

        await refreshTasks();
        setSelectedButton(0);
        setStatus("default");
        handleCloseModal();
      } catch (error) {
        toast.error(
          t('HometaskStudent.components.page.Messages.CancelError'),
          {
            position: "bottom-right",
            autoClose: 5000
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [hometaskDoneInModal, hometaskInModal, token, refreshTasks, t]);

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
      case t('HometaskStudent.components.page.SortOptions.NewestFirst'):
        return [...tasks].sort((a, b) => new Date(b.StartDate || b.DoneDate) - new Date(a.StartDate || a.DoneDate));
      case t('HometaskStudent.components.page.SortOptions.OldestFirst'):
        return [...tasks].sort((a, b) => new Date(a.StartDate || a.DoneDate) - new Date(b.StartDate || b.DoneDate));
      case t('HometaskStudent.components.page.SortOptions.Alphabetical'):
        return [...tasks].sort((a, b) => a.HomeTaskHeader.localeCompare(b.HomeTaskHeader));
      default:
        return tasks;
    }
  }, [t]);

  const sortAllTasks = useCallback((option) => {
    setNewHomeTasks((prev) => sortTasks(prev, option));
    setPendingHomeTasks((prev) => sortTasks(prev, option));
    setDoneHomeTasks((prev) => sortTasks(prev, option));
  }, [sortTasks]);

  const selectedTasks = useMemo(() => {
    if (isSwitching) return [];
    return selectedButton === 0 ? newHomeTasks : selectedButton === 1 ? pendingHomeTasks : doneHomeTasks;
  }, [selectedButton, newHomeTasks, pendingHomeTasks, doneHomeTasks, isSwitching]);

  return (
    <div>
      {isModalOpen && (
        <div className="hometask-modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4" tabIndex={-1} ref={(el) => el?.focus()}>
          <div className="hometask-modal-content w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            {!isDataLoaded ? (
              <div className="modal-loading p-4 text-center">{t('HometaskStudent.components.page.Loading')}</div>
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
                onSendHometask={sendHometask}
                onCancelHometask={cancelHometask}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      )}
      <main>
        <div className="hometask p-3 sm:p-6">

          <div className="nav flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="task-buttons-wrapper flex items-center overflow-x-auto w-full sm:w-auto sm:h-auto p-2 space-x-1 no-scrollbar">
              {buttons.map((button, index) => (
                <TaskButton
                  key={index}
                  text={button.text}
                  icon={button.icon}
                  count={button.count}
                  isSelected={selectedButton === index}
                  onClick={() => handleButtonClick(index)}
                  className="flex-shrink-0 m-1 first:ml-0 last:mr-0 "
                />
              ))}
            </div>

            <div className="search-wrapper flex items-center w-full sm:w-auto">
              <SearchButton
                onSearchClick={() => handleSearch(searchQuery)}
                value={searchQuery}
                setValue={setSearchQuery}
                className="w-full"
              />
            </div>
          </div>


          <div className="buttons-box flex flex-col sm:flex-row sm:justify-between gap-2 my-4">
            <div className="w-full sm:w-auto">
              <Dropdown
                options={subjects}
                onSelectSubject={(subject) => setSelectedSubject(subject)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-auto  mb-2">
            {/* <ToggleSwitch isOn={isBlock} setIsOn={setIsBlock} /> */}
              <SortDropdown
                options={[
                  t('HometaskStudent.components.page.SortOptions.NewestFirst'),
                  t('HometaskStudent.components.page.SortOptions.OldestFirst'),
                  t('HometaskStudent.components.page.SortOptions.Alphabetical')
                ]}
                onSelect={(option) => sortAllTasks(option)}
                className="w-full"
              />
            </div>
          </div>


          <div className="flex flex-wrap gap-4 items-center my-7">
            {isSwitching ? (
              <div className="w-full text-center py-4">{t('HometaskStudent.components.page.Loading')}</div>
            ) : selectedTasks.length === 0 ? (
              <div className="w-full text-center text-gray-500 py-4">{t('HometaskStudent.components.page.NoTasks')}</div>
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