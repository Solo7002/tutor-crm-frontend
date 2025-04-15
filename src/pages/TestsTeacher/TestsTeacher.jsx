import "./TestsTeacher.css";
import TestItem from "./components/TestItem/TestItem";
import SearchButton from "../Materials/components/SearchButton";
import Dropdown from "../../components/Dropdown/Dropdown";
import TaskButton from "../../components/TaskButton/TaskButton";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import CreateModal from "./components/CreateModal/CreateModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TestsTeacher = () => {
  const token = sessionStorage.getItem("token") || "";
  const [teacher_id, setTeacher_id] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [originalTests, setOriginalTests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Усі групи");
  const [selectedCourse, setSelectedCourse] = useState("Усі курси");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupedTests, setGroupedTests] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      const decoded = jwtDecode(token);
      const teacherResponse = await axios.get(
        `http://localhost:4000/api/teachers/search?UserId=${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeacher_id(teacherResponse.data.data[0].TeacherId);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacher_id || !token) return;

      try {
        setLoading(true);

        const testsResponse = await axios.get(
          `http://localhost:4000/api/tests/tests-by-teacher/${teacher_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTests(testsResponse.data);
        setOriginalTests(testsResponse.data);
        setFilteredTests(testsResponse.data);

        const groupsResponse = await axios.get(
          `http://localhost:4000/api/groups/groups-by-teacher/${teacher_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const transformedGroups = groupsResponse.data.map((group) => ({
          SubjectName: group.GroupName,
        }));
        setGroups(transformedGroups);

        const coursesResponse = await axios.get(
          `http://localhost:4000/api/courses/courses-by-teacher/${teacher_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const transformedCourses = coursesResponse.data.map((course) => ({
          SubjectName: course.CourseName,
        }));
        setCourses(transformedCourses);

        setLoading(false);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [teacher_id, token]);

  const handleSearch = (query) => {
    if (query === "") {
      setTests(originalTests);
      setFilteredTests(originalTests);
    } else {
      const filtered = originalTests.filter((test) =>
        test.TestName.toLowerCase().includes(query.toLowerCase())
      );
      setTests(filtered);
      setFilteredTests(filtered);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    let filtered = tests;
    if (selectedGroup !== "Усі групи") {
      filtered = filtered.filter((test) => test.GroupName === selectedGroup);
    }
    if (selectedCourse !== "Усі курси") {
      filtered = filtered.filter((test) => test.CourseName === selectedCourse);
    }

    setFilteredTests(filtered);
  }, [selectedGroup, selectedCourse, tests]);

  useEffect(() => {
    const grouped = filteredTests.reduce((acc, test) => {
      const courseName = test.CourseName || "Курс не вказано";
      if (!acc[courseName]) {
        acc[courseName] = [];
      }
      acc[courseName].push(test);
      return acc;
    }, {});
    setGroupedTests(grouped);
  }, [filteredTests]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  return (
    <div className="TestsTeacher mt-6 mr-10">
      <div className="flex items-center m-2 gap-2">
        <div className="w-[139px] h-12 relative">
          <div className="left-0 top-0 absolute inline-flex justify-start items-center gap-2 overflow-hidden">
            <div data-number-visible="false" data-property-1="Active" data-size="Big" className="h-12 px-4 py-2 bg-[#8a48e6] rounded-[32px] flex justify-start items-center gap-2">
              <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1H16M5 7H16M5 13H16M1 1V1.01M1 7V7.01M1 13V13.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="justify-center text-white text-[15px] font-bold font-['Nunito']">Назначені</div>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <SearchButton
            onSearchClick={() => handleSearch(searchQuery)}
            value={searchQuery}
            setValue={setSearchQuery}
          />
        </div>
      </div>

      <div className="flex items-baseline space-x-4 m-2 mb-6 mt-4">
        <Dropdown
          options={courses}
          textAll="Усі курси"
          onSelectSubject={handleSelectCourse}
        />
        <Dropdown
          options={groups}
          textAll="Усі групи"
          onSelectSubject={handleSelectGroup}
        />
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        {loading ? (
          <div>Loading tests...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : Object.keys(groupedTests).length === 0 ? (
          <div>No tests found for this teacher.</div>
        ) : (
          <div className="mb-[200px]">
            {Object.entries(groupedTests).map(([courseName, courseTests]) => (
              <div key={courseName} className="mb-8">
                <div className="w-full text-left text-[#120C38] text-[24px] font-[Nunito] font-bold mb-4">
                  Курс: {courseName}
                </div>
                <div className="flex flex-wrap justify-start gap-4">
                  {courseTests.map((test) => (
                    <TestItem key={test.TestId} test={test} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white z-10 p-4 flex justify-center items-center">
        <PrimaryButton className="w-96" onClick={handleOpenModal}>
          Створити
        </PrimaryButton>
      </div>

      {isModalOpen && <CreateModal onClose={handleCloseModal} teacher_id={teacher_id} token={token} />}
    </div>
  );
};

export default TestsTeacher;