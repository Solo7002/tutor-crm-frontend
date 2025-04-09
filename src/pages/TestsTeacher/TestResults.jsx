import "./TestResults.css";
import { useParams,useNavigate } from "react-router-dom";
import TaskButton from "../../components/TaskButton/TaskButton";
import StudentItem from "./components/StudentItem/StudentItem";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../../functions/formatDate";

const TestResults = () => {
  const [test, setTest] = useState(null);
  const [studentsDone, setStudentsDone] = useState([]);
  const [studentsNotDone, setStudentsNotDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0); 

  const token = localStorage.getItem("token") || "";
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const testsResponse = await axios.get(
          `http://localhost:4000/api/tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Test Response:", testsResponse.data);
        setTest(testsResponse.data);

        const studentsDoneResponse = await axios.get(
          `http://localhost:4000/api/tests/students-done/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Students Done Response:", studentsDoneResponse.data);
        setStudentsDone(studentsDoneResponse.data);

        const studentsNotDoneResponse = await axios.get(
          `http://localhost:4000/api/tests/students-not-done/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Students Not Done Response:", studentsNotDoneResponse.data);
        
        
        setStudentsNotDone(studentsNotDoneResponse.data);
        console.log(studentsNotDone);
        

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

  const handleDeleteTest=()=>{
    try{
        axios.delete(`http://localhost:4000/api/tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
       navigate('/teacher/tests');
       navigate(0);
    }catch(error){
      console.log(error.error);
      
    }
  }
  const handleTabClick = (tabIndex) => {
    setSelectedTab(tabIndex);
  };


  const displayedStudents = selectedTab === 0 ? studentsDone : studentsNotDone;

  return (
    <div className="TestResults p-4 rounded-lg">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : test ? (
        <>
          <div className="text-left text-[#120c38] text-2xl font-bold font-['Nunito'] mb-4">
            Результати тесту: {test.TestName}
          </div>
          <div className="flex justify-between items-start">
            <div className="w-52">
              <div className="text-[#827ead] text-xl font-normal font-['Mulish']">
                Курс: {test.CourseName || "N/A"}
              </div>
              <div className="text-[#827ead] text-xl font-normal font-['Mulish'] mt-2">
                Група: {test.GroupName || "N/A"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#827ead] text-xl font-normal font-['Mulish']">
                Видано: {formatDate(test.CreatedDate)}
              </div>
              <div className="text-[#827ead] text-xl font-normal font-['Mulish'] mt-2">
                Термін до: {formatDate(test.DeadlineDate)}
              </div>
            </div>
          </div>
          <div className="flex space-x-4 m-2  mb-8">
            <TaskButton
              text={"Виконало учнів"}
              icon={"M1 6L6 11L16 1"}
              isSelected={selectedTab === 0}
              count={studentsDone.length}
              onClick={() => handleTabClick(0)}
            />
            <TaskButton
              text={"Не виконало учнів"}
              icon={
                "M3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 8.8181 1.23279 7.64778 1.68508 6.55585C2.13738 5.46392 2.80031 4.47177 3.63604 3.63604C4.47177 2.80031 5.46392 2.13738 6.55585 1.68508C7.64778 1.23279 8.8181 1 10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604M3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604M3.63604 16.364L16.364 3.63604"
              }
              isSelected={selectedTab === 1}
              count={studentsNotDone.length}
              onClick={() => handleTabClick(1)}
            />
          </div>

          <div >
            {displayedStudents.length === 0 ? (
              <div>
               
              </div>
            ) : (
              <div className="flex flex-wrap justify-start gap-4 mb-[100px] ">
              {displayedStudents.map((student, index) => (
                <StudentItem
                  key={index}
                  name={`${student.FirstName} ${student.LastName}`}
                  date={formatDate(student.DoneDate) || formatDate(test.CreatedDate)}
                  score={student.Score}
                  maxScore={student.MaxScore}
                  status={student.Status}
                  img={student.ImageFilePath}
                
                />
              ))}
            </div>
            
            )}
          </div>
          <div className="md:fixed bottom-0 left-0 right-0 bg-white z-10 p-2 flex justify-center items-center space-x-3">
            <PrimaryButton className="w-96" onClick={handleDeleteTest}>Видалити тест</PrimaryButton>
          </div>
        </>
      ) : (
        <div>No test details available.</div>
      )}
    </div>
  );
};

export default TestResults;