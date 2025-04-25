import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import SearchButton from "./components/SearchButton";
import TaskButton from "./components/TaskButton/TaskButton";
import TestCard from "./components/TestCard/TestCard";
import TestModal from "./components/TestModal/TestModal";
import SortDropdown from "../Materials/components/SortDropdown";
import { toast } from 'react-toastify';

const TestStudent = () => {
  const { t } = useTranslation();
  
  const buttons = [
    { text: t("Tests.TestStudent.toComplete"), icon: "M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01", count: 0 },
    { text: t("Tests.TestStudent.completed"), icon: "M5 12L10 17L20 7", count: 0 },
  ];

  const [token, setToken] = useState();
  const [completedView, setCompletedView] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState(0);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [userId, setUserId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [tests, setTests] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    if (sortOption === null){
      setSortOption(t("Tests.TestStudent.sortNewest"));
    }
  }, [sortOption])

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setToken(token);
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        toast.error(t("Tests.TestStudent.errors.tokenDecode"));
      }
    }
  }, [t]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${process.env.REACT_APP_BASE_API_URL}/api/students/search-by-user-id/${userId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
        .then((response) => {
          if (response.data.success) {
            setStudentId(response.data.data[0].StudentId);
          }
        })
        .catch((error) => {
          toast.error(t("Tests.TestStudent.errors.studentIdGet"));
        });
    }
  }, [userId, t]);

  useEffect(() => {
    if (studentId) {
      axios
        .get(`${process.env.REACT_APP_BASE_API_URL}/api/tests/tests-by-student/${studentId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
        .then((response) => {
          setTests(response.data);
        })
        .catch((error) => {
          toast.error(t("Tests.TestStudent.errors.testsGet"));
        });
    }
  }, [studentId, t]);

  const handleTabButtonClick = (index) => {
    setTab(index);
    setSelectedButton(index);
  };

  const handleSearch = (query) => {
    // Implementation remains the same
  };

  const handleDetailsClick = (test) => {
    setSelectedTest(test);
    setIsModalOpened(true);
  };

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  const sortOptions = [
    t("Tests.TestStudent.sortNewest"), 
    t("Tests.TestStudent.sortOldest"), 
    t("Tests.TestStudent.sortAlphabetical")
  ];

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
            options={sortOptions}
            onSelect={setSortOption}
          />
        </div>
      </div>
      <div className="w-full flex flex-wrap gap-4 mt-10">
        {tests
          .filter((t) => (tab === 0 && !t.isDone) || (tab === 1 && t.isDone))
          .filter((t) => t.TestName.toLowerCase().includes(searchQuery.toLowerCase()))
          .sort((a, b) => {
            if (sortOption === t("Tests.TestStudent.sortNewest")) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOption === t("Tests.TestStudent.sortOldest")) {
              return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortOption === t("Tests.TestStudent.sortAlphabetical")) {
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