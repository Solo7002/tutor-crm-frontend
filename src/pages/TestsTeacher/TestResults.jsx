import "./TestResults.css";
import { useParams, useNavigate } from "react-router-dom";
import TaskButton from "./components/TaskButton/TaskButton";
import StudentItem from "./components/StudentItem/StudentItem";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../../functions/formatDate";
import { decryptData } from '../../utils/crypto';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TestResults = () => {
  const { t } = useTranslation();
  const [testId, setTestId] = useState();
  const [test, setTest] = useState(null);
  const [studentsDone, setStudentsDone] = useState([]);
  const [studentsNotDone, setStudentsNotDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const token = localStorage.getItem("token") || "";
  const { encodedTestId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (encodedTestId){
      try {
        const decryptedTestId = decryptData(encodedTestId);
        setTestId(decryptedTestId);
      }
      catch (error) {
        toast.error(t("Tests.TestResults.errorMessage"));
      }
    }
  }, [encodedTestId, t])

  useEffect(() => {
    if (!testId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const testsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTest(testsResponse.data);

        const studentsDoneResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/tests/students-done/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudentsDone(studentsDoneResponse.data);

        const studentsNotDoneResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/tests/students-not-done/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudentsNotDone(studentsNotDoneResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (testId) {
      fetchData();
    } else {
      setError("Test ID is required");
      setLoading(false);
    }
  }, [testId, token]);

  const handleDeleteTest = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/tests/${testId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success(
        <div>
          <p>{t("Tests.TestResults.testDeletedSuccess")}</p>
          <p>{t("Tests.TestResults.title")} {test.TestName}</p>
          <p>{t("Tests.TestResults.group")} {test.GroupName || t("Tests.TestResults.unknown")}</p>
        </div>,
        { autoClose: 5000 }
      );
      
      setTimeout(() => {
        navigate('/teacher/tests');
      }, 1500);
    } catch (error) {
      toast.error(t("Tests.TestResults.errorMessage"));
      const errorMessage = error.response?.data?.message || error.message || t("Tests.TestResults.deleteFailure");
      toast.error(errorMessage);
    }
  }

  const handleTabClick = (tabIndex) => {
    setSelectedTab(tabIndex);
  };


  const displayedStudents = selectedTab === 0 ? studentsDone : studentsNotDone;

  return (
    <div className="TestResults p-3 md:p-4 lg:pr-10 mt-2 md:mt-4 rounded-lg w-full">
      {loading ? (
        <div>{t("Tests.TestResults.loading")}</div>
      ) : error ? (
        <div>{t("Tests.TestResults.error")} {error}</div>
      ) : test ? (
        <>
          <div className="flex justify-between items-center mb-2 md:mb-4">
            <div className="text-left text-[#120c38] text-lg sm:text-xl md:text-2xl font-bold font-['Nunito'] pr-2">
              {t("Tests.TestResults.resultsTitle")} {test.TestName}
            </div>
            <div className="cursor-pointer" onClick={() => {navigate("/teacher/tests")}}>
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="">
              <div className="text-[#827ead] text-base sm:text-lg md:text-xl font-normal font-['Mulish']">
                {t("Tests.TestResults.course")} {test.CourseName || t("Tests.TestResults.notAvailable")}
              </div>
              <div className="text-[#827ead] text-base sm:text-lg md:text-xl font-normal font-['Mulish'] mt-1 md:mt-2">
                {t("Tests.TestResults.group")} {test.GroupName || t("Tests.TestResults.notAvailable")}
              </div>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <div className="text-[#827ead] text-base sm:text-lg md:text-xl font-normal font-['Mulish']">
                {t("Tests.TestResults.issued")} {formatDate(test.CreatedDate)}
              </div>
              <div className="text-[#827ead] text-base sm:text-lg md:text-xl font-normal font-['Mulish'] mt-1 md:mt-2">
                {t("Tests.TestResults.deadline")} {formatDate(test.DeadlineDate)}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:space-x-4 mb-4 sm:mb-8 mt-3 sm:mt-5">
            <TaskButton
              text={t("Tests.TestResults.studentsDone")}
              icon={"M5 12L10 17L20 7"}
              isSelected={selectedTab === 0}
              count={studentsDone.length}
              onClick={() => handleTabClick(0)}
            />
            <TaskButton
              text={t("Tests.TestResults.studentsNotDone")}
              icon={
                "M3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 8.8181 1.23279 7.64778 1.68508 6.55585C2.13738 5.46392 2.80031 4.47177 3.63604 3.63604C4.47177 2.80031 5.46392 2.13738 6.55585 1.68508C7.64778 1.23279 8.8181 1 10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604M3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604M3.63604 16.364L16.364 3.63604"
              }
              isSelected={selectedTab === 1}
              count={studentsNotDone.length}
              onClick={() => handleTabClick(1)}
            />
          </div>
  
          <div>
            {displayedStudents.length === 0 ? (
              <div>
  
              </div>
            ) : (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 mb-24 sm:mb-[100px]">
                {displayedStudents.map((student, index) => (
                  <StudentItem
                    key={index}
                    name={`${student.FirstName} ${student.LastName}`}
                    date={formatDate(student.DoneDate) || formatDate(test.CreatedDate)}
                    score={student.Score}
                    maxScore={student.MaxScore}
                    status={student.Status}
                    img={student.ImageFilePath ? student.ImageFilePath : `https://ui-avatars.com/api/?name=${student.LastName + ' ' + student.FirstName}&background=random&size=86`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white z-10 p-2 flex justify-center items-center">
            <PrimaryButton className="w-full max-w-xs sm:max-w-sm md:max-w-md" onClick={handleDeleteTest}>
              {t("Tests.TestResults.deleteTest")}
            </PrimaryButton>
          </div>
        </>
      ) : (
        <div>{t("Tests.TestResults.noTestDetails")}</div>
      )}
    </div>
  );
};

export default TestResults;