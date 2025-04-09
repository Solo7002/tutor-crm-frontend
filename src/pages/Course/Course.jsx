import { useState, useEffect } from "react";
import CourseForm from "./components/CourseForm/CourseForm";
import axios from "axios";
import CourseModal from "./components/CourseModal/CourseModal";
const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[courseName,setCourseName]=useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);  
  const [isSaveTriggered, setIsSaveTriggered] = useState(false); 
  const [isAddingNew, setIsAddingNew] = useState(false);  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const teacherId = 1;
 const token="";
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/courses/courses-by-teacher/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Помилка при завантаженні курсів");
        setLoading(false);
      }
    };
    fetchCourses();
  }, [teacherId]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAddingNew(false);  
  };
  const handleCourseClick = (courseId,courseName) => {
    setSelectedCourseId(courseId); 
    setIsSaveTriggered(false); 
    setCourseName(courseName);
    setIsAddingNew(false); 
  };

  const handleAddCourseClick = () => {
    setSelectedCourseId(null); 
    setIsModalOpen(true);
    setIsSaveTriggered(false); 
    setIsAddingNew(true);
  };

  const handleSaveClick = () => {
    setIsSaveTriggered(true); 
  };

  if (loading) return <div className="text-center p-4">Завантаження...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen">
 <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        teacherId={teacherId}
        token={token}
      />
      <div className="m-4">
        <div className="w-80 h-auto bg-white rounded-[20px] p-4">
          <div className="flex flex-col items-center gap-2">
            {courses.map((course) => {
             
              return (
                <button
                  key={course.courseId}
                  className={`w-full h-10 px-4 py-2 rounded-[40px] flex justify-center items-center gap-2.5 cursor-pointer transition-all `}
                  onClick={() => handleCourseClick(course.CourseId,course.CourseName)}
                >
                  <div className="text-base font-bold font-['Nunito']">{course.CourseName}</div>
                </button>
              );
            })}
            
            <button
              className={`w-full h-10 px-4 py-2 rounded-[40px] flex justify-center items-center gap-2.5 cursor-pointer transition-all`}
              onClick={handleAddCourseClick}
            >
              <div className="text-base font-bold font-['Nunito']">Додати курс</div>
            </button>
          </div>
        </div>
      </div>

     
      {selectedCourseId && !isAddingNew && (
        
          <CourseForm
            courseId={selectedCourseId}
            isSave={isSaveTriggered}
            isNewCourse={isAddingNew}
            CourseName={courseName}
          />
         
      )}

       
      {selectedCourseId && !isAddingNew && (
        <div className="fixed bottom-0 left-0 w-full h-24 bg-white shadow-lg flex justify-center items-center">
          <div
            className="w-96 h-12 px-10 py-2 bg-[#8a48e6] rounded-2xl flex justify-center items-center gap-2.5 cursor-pointer"
            onClick={handleSaveClick}
          >
            <div className="text-white text-xl font-medium font-['Nunito']">Зберегти зміни</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;