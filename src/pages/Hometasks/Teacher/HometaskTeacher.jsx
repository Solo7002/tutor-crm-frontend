import React, { useState, useEffect, useRef } from "react";
import "./HometaskTeacher.css";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import SearchButton from '../../Materials/components/SearchButton';
import ToggleSwitch from '../../Materials/components/ToggleSwitch';
import Dropdown from './Components/Dropdown/Dropdown';
import SortDropdown from '../../Materials/components/SortDropdown';
import { SecondaryButton } from "./Components/Buttons/Buttons";
import TaskCardBlock from "./Components/TaskCardBlock/TaskCardBlock";
import TaskCardTile from "./Components/TaskCardBlock/TaskCardTile";
import HomeTaskCreateModal from "./Components/HomeTaskCreateModal/HomeTaskCreateModal";
import TaskCardBlock2 from "./Components/TaskCardBlock/TaskCardBlock2";
import FilterButton from "./Components/HomeTaskCheck/FilterButton";
import UserCard from "./Components/HomeTaskCheck/UserCard";
import HomeTaskCheckModal from "./Components/HomeTaskCreateModal/HomeTaskCheckModal";
import EvaluateAIModal from "./Components/HomeTaskCreateModal/EvaluateAIModal";
import EvaluateModal from "./Components/HomeTaskCreateModal/EvaluateModal";

const scrollbarFunction = () => {
  const scrollContainer = document.getElementById('scrollContainer');

  if (!scrollContainer) {
    return;
  }

  let isDown = false;
  let startX;
  let scrollLeft;

  scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('mouseup', () => {
    isDown = false;
  });

  scrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
  });

  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX);
    scrollContainer.scrollLeft = scrollLeft - walk;
  });
}

const SaveToLocalStorage = (states) => {
  const {
    isBlockType,
    selectedCourseName,
    selectedGroupName,
    searchQuery,
    sortOption,
    isManagerPage,
    selectedCard,
    selectedFilter,
    isExpanded
  } = states;

  useEffect(() => {
    localStorage.setItem('isBlockType', JSON.stringify(isBlockType));
  }, [isBlockType]);

  useEffect(() => {
    localStorage.setItem('selectedCourseName', selectedCourseName || '');
  }, [selectedCourseName]);

  useEffect(() => {
    localStorage.setItem('selectedGroupName', selectedGroupName || '');
  }, [selectedGroupName]);

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('sortOption', sortOption);
  }, [sortOption]);

  useEffect(() => {
    localStorage.setItem('isManagerPage', JSON.stringify(isManagerPage));
  }, [isManagerPage]);

  useEffect(() => {
    localStorage.setItem('selectedCard', selectedCard || '');
  }, [selectedCard]);

  useEffect(() => {
    localStorage.setItem('selectedFilter', selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    localStorage.setItem('isExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);
};

const HometaskTeacher = () => {
  const [isBlockType, setIsBlockType] = useState(() => {
    const saved = localStorage.getItem('isBlockType');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [teacherData, setTeacherData] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(() => {
    return localStorage.getItem('selectedCourseName') || null;
  });
  const [selectedGroupName, setSelectedGroupName] = useState(() => {
    return localStorage.getItem('selectedGroupName') || null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('searchQuery') || "";
  });
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem('sortOption') || "Спочатку нові";
  });
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedHometask, setSelectedHometask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [isManagerPage, setIsManagerPage] = useState(() => {
    const saved = localStorage.getItem('isManagerPage');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [selectedCard, setSelectedCard] = useState(() => {
    return localStorage.getItem('selectedCard') || null;
  });
  const [selectedFilter, setSelectedFilter] = useState(() => {
    return localStorage.getItem('selectedFilter') || "check";
  });
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('isExpanded');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const cardRefs = useRef([]);
  const [selectedHometask2, setSelectedHometask2] = useState(null);
  const [selectedDoneHometask, setSelectedDoneHometask] = useState();
  const [isCheckModalOpened, setIsCheckModalOpened] = useState(false);
  const [isEvaluateModalOpened, setIsEvaluateModalOpened] = useState(false);
  const [isEvaluateAIModalOpened, setIsEvaluateAIModalOpened] = useState(false);

  scrollbarFunction();

  SaveToLocalStorage({
    isBlockType,
    selectedCourseName,
    selectedGroupName,
    searchQuery,
    sortOption,
    isManagerPage,
    selectedCard,
    selectedFilter,
    isExpanded
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const teacherId = decoded.id;
        axios.get(`http://localhost:4000/api/hometasks/hometask-data-by-teacher-id/${teacherId}`)
          .then(response => {
            setTeacherData(response.data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Ошибка при получении данных преподавателя:", error);
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Ошибка при расшифровке токена:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (teacherData && teacherData.Courses.length > 0 && !selectedCourseName) {
      const firstCourse = teacherData.Courses[0];
      setSelectedCourseName(firstCourse.CourseName);
      if (firstCourse.Groups.length > 0) {
        setSelectedGroupName(firstCourse.Groups[0].GroupName);
      }
    }
  }, [teacherData, selectedCourseName]);

  useEffect(() => {
    if (!isExpanded && selectedCard !== null) {
      cardRefs.current[selectedCard]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [isExpanded, selectedCard]);

  const courseOptions = teacherData ? teacherData.Courses.map(course => course.CourseName) : [];
  const selectedCourse = teacherData && selectedCourseName
    ? teacherData.Courses.find(course => course.CourseName === selectedCourseName)
    : null;
  const groupOptions = selectedCourse ? selectedCourse.Groups.map(group => group.GroupName) : [];
  const selectedGroup = selectedCourse && selectedGroupName
    ? selectedCourse.Groups.find(group => group.GroupName === selectedGroupName)
    : null;

  const hometasks = selectedGroup ? selectedGroup.Hometasks : [];
  const filteredHometasks = hometasks.filter(hometask =>
    hometask.HometaskHeader.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedHometasks = [...filteredHometasks].sort((a, b) => {
    if (sortOption === "Спочатку нові") {
      return new Date(b.HometaskStartDate) - new Date(a.HometaskStartDate);
    } else if (sortOption === "Спочатку старі") {
      return new Date(a.HometaskStartDate) - new Date(b.HometaskStartDate);
    } else if (sortOption === "За алфавітом") {
      return a.HometaskHeader.localeCompare(b.HometaskHeader);
    }
    return 0;
  });

  const openModalForEdit = (hometask) => {
    setSelectedHometask(hometask);
    setIsModalOpened(true);
  };


  const getCheckStudents = () => {
    if (!selectedHometask2) return [];
    return selectedHometask2.DoneHometasks.filter((done) => done.Mark === -1);
  };

  const getDoneStudents = () => {
    if (!selectedHometask2) return [];
    return selectedHometask2.DoneHometasks.filter((done) => done.Mark !== -1);
  };

  const getNotDoneStudents = () => {
    if (!selectedHometask2) return [];
    return selectedHometask2.NotDoneHometaskStudents;
  };

  const renderUserCards = () => {
    let students = [];
    if (selectedFilter === "check") {
      students = getCheckStudents();
    } else if (selectedFilter === "done") {
      students = getDoneStudents();
    } else if (selectedFilter === "not_done") {
      students = getNotDoneStudents();
    }

    if (students.length === 0) {
      return <div>Ще немає завдань</div>;
    }

    return students.map((student, index) => (
      <UserCard
        key={index}
        type={selectedFilter}
        doneHometask={selectedFilter !== "not_done" ? student : null}
        student={selectedFilter === "not_done" ? student : student.Student}
        MaxMark={selectedHometask2.MaxMark}
        openModalHandler={() => { setIsCheckModalOpened(true); setSelectedDoneHometask(student) }}
      />
    ));
  };

  useEffect(() => {
    if (teacherData && selectedCard) {
      const selectedCourse = teacherData.Courses.find(course => course.CourseName === selectedCourseName);
      if (selectedCourse) {
        const selectedGroup = selectedCourse.Groups.find(group => group.GroupName === selectedGroupName);
        if (selectedGroup) {
          const actualHometask = selectedGroup.Hometasks.find(ht => ht.HometaskId === selectedCard);
          if (actualHometask) {
            setSelectedHometask2(actualHometask);
          } else {
            setSelectedCard(null);
            setSelectedHometask2(null);
          }
        }
      }
    }
  }, [teacherData, selectedCard, selectedCourseName, selectedGroupName]);


  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="hometask-teacher-page px-4 md:pr-10">
      <HomeTaskCreateModal
        isOpened={isModalOpened}
        onClose={() => { setIsModalOpened(false); setSelectedHometask(null); }}
        subject={selectedCourseName}
        group={selectedGroupName}
        selectedGroupId={selectedGroup ? selectedGroup.GroupId : null}
        hometask={selectedHometask}
        setRefreshTrigger={() => setRefreshTrigger(!refreshTrigger)}
      />
      <HomeTaskCheckModal
        isOpened={isCheckModalOpened}
        onClose={() => { setIsCheckModalOpened(false); }}
        subject={selectedCourseName}
        group={selectedGroupName}
        selectedGroupId={selectedGroup ? selectedGroup.GroupId : null}
        hometask={selectedHometask2}
        doneHometask={selectedDoneHometask}
        setRefreshTrigger={() => setRefreshTrigger(!refreshTrigger)}
        onEvaluate={() => { setIsCheckModalOpened(false); setIsEvaluateModalOpened(true) }}
        onEvaluateAI={() => { setIsCheckModalOpened(false); setIsEvaluateAIModalOpened(true) }}
      />
      <EvaluateModal
        isOpened={isEvaluateModalOpened}
        onClose={() => { setIsEvaluateModalOpened(false); setIsCheckModalOpened(true) }}
        onNext={() => { setIsEvaluateModalOpened(false); setIsEvaluateAIModalOpened(true); }}
        hometask={selectedHometask2}
        doneHometask={selectedDoneHometask}
        setRefreshTrigger={() => { setRefreshTrigger(!refreshTrigger); setIsCheckModalOpened(false); }}
      />
      <EvaluateAIModal
        isOpened={isEvaluateAIModalOpened}
        onClose={() => { setIsEvaluateAIModalOpened(false); setIsCheckModalOpened(true) }}
        onNext={() => { setIsEvaluateModalOpened(true); setIsEvaluateAIModalOpened(false); }}
        hometask={selectedHometask2}
        doneHometask={selectedDoneHometask}
        subject={selectedCourseName}
        setRefreshTrigger={() => { setRefreshTrigger(!refreshTrigger); setIsCheckModalOpened(false); }}
      />
  
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 md:mt-8 gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Dropdown
            options={courseOptions}
            onSelectSubject={(courseName) => {
              setSelectedCourseName(courseName);
              let newCurrentGroups = teacherData.Courses.find(course => course.CourseName === courseName).Groups;
              setSelectedGroupName(newCurrentGroups.length > 0 ? newCurrentGroups[0].GroupName : null);
            }}
            selectedValue={selectedCourseName}
          />
          <Dropdown
            options={groupOptions}
            onSelectSubject={(groupName) => {
              setSelectedGroupName(groupName);
            }}
            selectedValue={selectedGroupName}
          />
        </div>
        <div className="w-full sm:w-[210px] stroke-purple-600 hover:stroke-white mt-3 sm:mt-0">
          <SecondaryButton onClick={() => setIsManagerPage(!isManagerPage)}>
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0">
                {!isManagerPage ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4V20H7C6.46957 20 5.96086 19.7893 5.58579 19.4142C5.21071 19.0391 5 18.5304 5 18V6C5 5.46957 5.21071 4.96086 5.58579 4.58579C5.96086 4.21071 6.46957 4 7 4H19Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M19 16H7C6.46957 16 5.96086 16.2107 5.58579 16.5858C5.21071 16.9609 5 17.4696 5 18M9 8H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L20 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>}
  
              </div>
              <div className="ml-7 text-sm md:text-base">{isManagerPage ? "Перевірка завданнь" : "Менеджер завдань"}</div>
            </div>
          </SecondaryButton>
        </div>
      </div>
  
      {
        isManagerPage ?
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 md:mt-6 gap-3">
              <div className="flex items-center gap-2">
                <ToggleSwitch isOn={isBlockType} setIsOn={setIsBlockType} />
                <div className="mt-1">
                  <SortDropdown
                    options={["Спочатку нові", "Спочатку старі", "За алфавітом"]}
                    onSelect={setSortOption}
                  />
                </div>
              </div>
              <div className="w-full sm:w-auto mt-3 sm:mt-0">
                <SearchButton
                  value={searchQuery}
                  setValue={setSearchQuery}
                  onSearchClick={() => { }}
                />
              </div>
            </div>
  
            {hometasks.length > 0 && (
              <div className="flex flex-wrap gap-3 md:gap-5 mt-4 md:mt-5 justify-center sm:justify-start">
                {isBlockType ? (
                  <div
                    className="task-block-card relative w-full sm:w-[calc(50%-12px)] md:w-[420px] h-[180px] sm:h-[230px] p-4 rounded-3xl border border-[#e0e0e0] transition-colors duration-100 ease-in-out group hover:border-purple-600 cursor-pointer"
                    style={{ backgroundImage: 'linear-gradient(to top right, white, transparent)' }}
                    onClick={() => { setIsModalOpened(true); setSelectedHometask(null); }}
                  >
                    <div className="w-full h-full relative rounded-3xl">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="flex justify-center">
                          <svg className="transition-transform duration-300 ease-in-out group-hover:scale-105 w-10 h-10 md:w-11 md:h-11" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.25 20.9544H28.75M22 14.4973V27.4115M1.75 20.9544C1.75 23.4983 2.27378 26.0173 3.29144 28.3675C4.3091 30.7177 5.8007 32.8532 7.68109 34.652C9.56147 36.4508 11.7938 37.8777 14.2507 38.8512C16.7075 39.8247 19.3407 40.3257 22 40.3257C24.6593 40.3257 27.2925 39.8247 29.7493 38.8512C32.2062 37.8777 34.4385 36.4508 36.3189 34.652C38.1993 32.8532 39.6909 30.7177 40.7086 28.3675C41.7262 26.0173 42.25 23.4983 42.25 20.9544C42.25 15.8168 40.1165 10.8896 36.3189 7.2568C32.5213 3.62397 27.3706 1.58307 22 1.58307C16.6294 1.58307 11.4787 3.62397 7.68109 7.2568C3.88348 10.8896 1.75 15.8168 1.75 20.9544Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-[#120c38] text-base md:text-[20px] font-normal font-['Mulish'] mt-3 md:mt-5 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:font-semibold">
                          Додати завдання
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="task-block-card relative w-full sm:w-[calc(100%-12px)] md:w-[640px] h-[100px] sm:h-[160px] p-4 rounded-3xl border border-[#e0e0e0] transition-colors duration-100 ease-in-out group hover:border-purple-600 cursor-pointer"
                    style={{ backgroundImage: 'linear-gradient(to top right, white, transparent)' }}
                    onClick={() => { setIsModalOpened(true); setSelectedHometask(null); }}
                  >
                    <div className="w-full h-full relative rounded-3xl">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
                        <div className="w-full flex items-center justify-center sm:justify-between">
                          <svg className="transition-transform duration-300 ease-in-out group-hover:scale-105 w-8 h-8 sm:w-11 sm:h-11" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.25 20.9544H28.75M22 14.4973V27.4115M1.75 20.9544C1.75 23.4983 2.27378 26.0173 3.29144 28.3675C4.3091 30.7177 5.8007 32.8532 7.68109 34.652C9.56147 36.4508 11.7938 37.8777 14.2507 38.8512C16.7075 39.8247 19.3407 40.3257 22 40.3257C24.6593 40.3257 27.2925 39.8247 29.7493 38.8512C32.2062 37.8777 34.4385 36.4508 36.3189 34.652C38.1993 32.8532 39.6909 30.7177 40.7086 28.3675C41.7262 26.0173 42.25 23.4983 42.25 20.9544C42.25 15.8168 40.1165 10.8896 36.3189 7.2568C32.5213 3.62397 27.3706 1.58307 22 1.58307C16.6294 1.58307 11.4787 3.62397 7.68109 7.2568C3.88348 10.8896 1.75 15.8168 1.75 20.9544Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="text-[#120c38] text-base md:text-[20px] font-normal font-['Mulish'] ml-3 sm:ml-10 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:font-semibold">
                            Додати завдання
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {sortedHometasks.map(hometask => (isBlockType ?
                  <TaskCardBlock key={hometask.HometaskId} hometask={hometask} onEdit={openModalForEdit} setRefreshTrigger={() => setRefreshTrigger(!refreshTrigger)}
                    className="w-full sm:w-[calc(50%-12px)] md:w-[420px]"
                  /> :
                  <TaskCardTile key={hometask.HometaskId} hometask={hometask} onEdit={openModalForEdit} setRefreshTrigger={() => setRefreshTrigger(!refreshTrigger)} 
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>
          :
          <div>
            <div className="w-full flex justify-between items-center mt-4 md:mt-7 mr-0 md:mr-3">
              <div className="font-[Nunito] font-[700] text-xl md:text-2xl leading-none tracking-tighter align-middle text-[#120C38]">Останні завдання</div>
              <div
                className="font-[Nunito] font-bold text-sm md:text-[15px] leading-none tracking-tighter text-right align-middle underline decoration-solid decoration-0 underline-offset-0 text-[#8A48E6] cursor-pointer hover:text-[#6a36b5]"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                Більше
              </div>
            </div>
  
            <div className="relative">
              <div
                className={`w-full flex mt-3 md:mt-5 ${isExpanded ? 'flex-wrap gap-3 md:gap-y-4' : 'overflow-x-auto hide-scrollbar py-1 pl-1 -ml-1'}`}
                id="scrollContainer"
              >
                {sortedHometasks.map(ht => (
                  <TaskCardBlock2
                    key={ht.HometaskId}
                    isSelected={selectedCard === ht.HometaskId}
                    onSelect={() => {
                      setSelectedCard(ht.HometaskId);
                      setSelectedHometask2(ht);
                      if (isExpanded) {
                        setIsExpanded(false);
                      }
                    }}
                    ref={el => cardRefs.current[ht.HometaskId] = el}
                    hometask={ht}
                    className={isExpanded ? "w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-16px)]" : "flex-shrink-0 w-[220px] sm:w-[280px] md:w-[320px]"}
                  />
                ))}
              </div>
              {!isExpanded && (
                <div className="w-16 sm:w-32 md:w-[217px] h-full absolute right-0 top-0 bg-gradient-to-l from-[#f6eeff] to-[#f6eeff]/0" />
              )}
            </div>
  
            {!isExpanded && (
              <div className="home_task_students">
                <div className="h-[calc(100vh-300px)] overflow-y-auto p-3 md:p-5 bg-white rounded-t-3xl border border-[#d7d7d7] mx-auto mt-4 md:mt-6">
                  <div className="flex flex-wrap gap-2 md:gap-4 items-center mb-4">
                    <FilterButton
                      isSelected={selectedFilter === "check"}
                      onSelect={() => { setSelectedFilter("check") }}
                      type={"check"}
                      text="До перевірки"
                      number={selectedHometask2 ? selectedHometask2.DoneHometasks.filter(dh => dh.Mark === -1).length : "0"}
                      className="flex-1 min-w-[120px]"
                    />
                    <FilterButton
                      isSelected={selectedFilter === "done"}
                      onSelect={() => { setSelectedFilter("done") }}
                      type={"done"}
                      text="Перевірено"
                      number={selectedHometask2 ? selectedHometask2.DoneHometasks.filter(dh => dh.Mark !== -1).length : "0"}
                      className="flex-1 min-w-[120px]"
                    />
                    <FilterButton
                      isSelected={selectedFilter === "not_done"}
                      onSelect={() => { setSelectedFilter("not_done") }}
                      type={"not_done"}
                      text="Не відправлено"
                      number={selectedHometask2 ? selectedHometask2.NotDoneHometaskStudents.length : "0"}
                      className="flex-1 min-w-[120px]"
                    />
                  </div>
                  <hr className="border-t border-[#d7d7d7] mb-4" />
                  <div className="w-full flex flex-wrap gap-4">
                    {renderUserCards()}
                  </div>
                </div>
              </div>
            )}
          </div>
      }
    </div>
  );
};

export default HometaskTeacher;