import { useState, useEffect } from "react";
import CourseForm from "./components/CourseForm/CourseForm";
import axios from "axios";
import CourseModal from "./components/CourseModal/CourseModal";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isSaveTriggered, setIsSaveTriggered] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const _token = sessionStorage.getItem("token");
    if (_token) {
      setToken(_token);
      const decoded = jwtDecode(_token);

      axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/teachers/search?UserId=${decoded.id}`)
        .then((res) => {
          setTeacherId(res.data.data[0].TeacherId);
        })
        .catch(err => {
          setError("Помилка при завантаженні даних вчителя");
        });
    }
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/courses/courses-by-teacher/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data.length > 0) {
          setSelectedCourseId(response.data[0].CourseId);
          setCourseName(response.data[0].CourseName);
        }

        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Помилка при завантаженні курсів");
        setLoading(false);
      }
    };
    fetchCourses();
  }, [teacherId, token]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAddingNew(false);
  };

  const handleCourseClick = (courseId, courseName) => {
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

  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
    setSelectedCourseId(newCourse.CourseId);
    setCourseName(newCourse.CourseName);
    setIsModalOpen(false);
    setIsAddingNew(false);
    toast.success(
      <div>
        <p>Курс успішно створено!</p>
        <p>Назва: {newCourse.CourseName}</p>
      </div>,
      { autoClose: 5000 }
    );
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses(courses.map(course =>
      course.CourseId === updatedCourse.CourseId ? updatedCourse : course
    ));
    setCourseName(updatedCourse.CourseName);
    setIsSaveTriggered(false);
    toast.success(
      <div>
        <p>Курс успішно оновлено!</p>
        <p>Назва: {updatedCourse.CourseName}</p>
      </div>,
      { autoClose: 5000 }
    );
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(courses.filter(course => course.CourseId !== courseId));
      if (selectedCourseId === courseId) {
        setSelectedCourseId(courses[0]?.CourseId || null);
        setCourseName(courses[0]?.CourseName || '');
      }
      toast.success(
        <div>
          <p>Курс успішно видалено!</p>
          <p>Назва: {courseName}</p>
        </div>,
        { autoClose: 5000 }
      );
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(
        error.response?.data?.message || "Не вдалося видалити курс. Спробуйте ще раз.",
        { autoClose: 5000 }
      );
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl font-medium text-purple-600 flex items-center">
        <svg className="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Завантаження...
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-600">
        {error}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        teacherId={teacherId}
        token={token}
        onCourseCreated={handleCourseCreated}
      />

      {/* Sidebar */}
      <div className="w-full md:w-80 p-4 bg-white md:min-h-screen md:shadow-md">
        <h2 className="text-xl font-bold mb-6 text-center font-[Nunito] text-[#120C38]">Мої курси</h2>
        <div className="flex flex-col items-center gap-3">
          {courses.map((course) => (
            <button
              key={course.courseId || course.CourseId}
              className={`w-full py-3 px-4 rounded-xl flex justify-center items-center transition-all 
                ${selectedCourseId === course.CourseId ? 
                'bg-purple-100 text-[#120C38] font-bold' : 
                'bg-white hover:bg-gray-100 text-gray-800'} 
                shadow-sm border border-gray-200`}
              onClick={() => handleCourseClick(course.CourseId, course.CourseName)}
            >
              <span className="text-base font-medium">{course.CourseName}</span>
            </button>

          // Delete course button
          //    <div key={course.CourseId} className="w-full flex items-center gap-2">
          //     <button
          //     className={`flex-1 py-3 px-4 rounded-xl flex justify-center items-center transition-all 
          //       ${selectedCourseId === course.CourseId ?
          //         'bg-purple-100 text-[#120C38] font-bold' :
          //         'bg-white hover:bg-gray-100 text-gray-800'} 
          //       shadow-sm border border-gray-200`}
          //     onClick={() => handleCourseClick(course.CourseId, course.CourseName)}
          //   >
          //     <span className="text-base font-medium">{course.CourseName}</span>
          //   </button>
          //   <button
          //     className="p-2 text-red-600 hover:text-red-800"
          //     onClick={() => handleDeleteCourse(course.CourseId, course.CourseName)}
          //   >
          //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          //       <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          //     </svg>
          //   </button>
          // </div>
          ))}

          <button
            className="w-full mt-4 py-3 px-4 rounded-xl flex justify-center items-center gap-2 
              bg-[#8A48E6] hover:bg-purple-700 text-white transition-all shadow-md"
            onClick={handleAddCourseClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-base font-medium">Додати курс</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-[#f5effd] flex-1 p-4">
        {selectedCourseId && !isAddingNew && (
          <CourseForm
            courseId={selectedCourseId}
            isSave={isSaveTriggered}
            isNewCourse={isAddingNew}
            CourseName={courseName}
            onCourseUpdated={handleCourseUpdated}
          />
        )}
      </div>

      {/* Save button */}
      {selectedCourseId && !isAddingNew && (
        <div className="fixed bottom-0 left-0 w-full py-4 px-6 bg-white shadow-lg flex justify-center items-center z-10">
          <button
            className="px-8 py-3 bg-[#8A48E6] hover:bg-purple-700 rounded-xl flex justify-center items-center gap-2 
              text-white font-medium shadow-md transition-all"
            onClick={handleSaveClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Зберегти зміни
          </button>
        </div>
      )}
    </div>
  );
};

export default Course;