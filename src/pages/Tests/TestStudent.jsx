import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SearchButton from "./components/SearchButton";
import TaskButton from "./components/TaskButton/TaskButton";
import TestCard from "./components/TestCard/TestCard";
import TestModal from "./components/TestModal/TestModal";
import SortDropdown from "../Materials/components/SortDropdown";

const buttons = [
  { text: "До виконання", icon: "M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01", count: 0 },
  { text: "Виконано", icon: "M5 12L10 17L20 7", count: 0 },
];

const TestStudent = () => {
  const [completedView, setCompletedView] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState(0);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [userId, setUserId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [tests, setTests] = useState([]);
  const [sortOption, setSortOption] = useState("Спочатку нові");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
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

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:4000/api/tests/tests-by-student/${studentId}`)
        .then((response) => {
          setTests(response.data);
        })
        .catch((error) => {
          console.error("Ошибка при получении тестов:", error);
        });
    }
  }, [studentId]);

  const handleTabButtonClick = (index) => {
    setTab(index);
    setSelectedButton(index);
  };

  const handleSearch = (query) => {
    
  };

  const handleDetailsClick = (test) => {
    setSelectedTest(test);
    setIsModalOpened(true);
  };

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  return (
    <div className="test-page w-full h-full mt-8 pr-6 relative">
      <TestModal
        isOpened={isModalOpened}
        onClose={handleCloseModal}
        test={selectedTest}
        studentId={studentId}
      />

      <div className="nav flex items-center justify-between">
        <div className="h-12 flex items-center gap-2 overflow-hidden">
          {buttons.map((button, index) => (
            <TaskButton
              key={index}
              text={button.text}
              icon={button.icon}
              count={button.count}
              isSelected={selectedButton === index}
              onClick={() => handleTabButtonClick(index)}
            />
          ))}
        </div>
        <div className="gap-2 flex">
          <SearchButton
            onSearchClick={() => handleSearch(searchQuery)}
            value={searchQuery}
            setValue={setSearchQuery}
          />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="mt-1">
          <SortDropdown
            options={["Спочатку нові", "Спочатку старі", "За алфавітом"]}
            onSelect={setSortOption}
          />
        </div>
      </div>
      <div className="w-full flex flex-wrap gap-4 mt-10">
        {tests
          .filter((t) => (tab === 0 && !t.isDone) || (tab === 1 && t.isDone))
          .filter((t) => t.TestName.toLowerCase().includes(searchQuery.toLowerCase()))
          .sort((a, b) => {
            if (sortOption === "Спочатку нові") {
              return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOption === "Спочатку старі") {
              return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortOption === "За алфавітом") {
              return a.TestName.localeCompare(b.TestName);
            }
            return 0;
          })
          .map((test, index) => (
            <TestCard key={index} test={test} onClick={() => handleDetailsClick(test)} />
          ))}
      </div>
    </div>
  );
};

export default TestStudent;