import { useState, useEffect } from "react";
import axios from 'axios';

export default function AccessManagementModal({ materialId, courses = [], isOpened = false, onClose = () => { } }) {
  const [expandedCourses, setExpandedCourses] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedGroups, setSelectedGroups] = useState({});
  const [selectedCourses, setSelectedCourses] = useState({});

  useEffect(() => {
    if (isOpened && courses.length > 0) {
      const initialStudentSelections = {};
      const initialGroupSelections = {};
      const initialCourseSelections = {};

      courses.forEach(course => {
        let allGroupsSelected = true;

        course.Groups.forEach(group => {
          let allStudentsSelected = true;

          group.Students.forEach(student => {
            initialStudentSelections[student.StudentId] = student.hasAccessToMaterial;
            if (!student.hasAccessToMaterial) {
              allStudentsSelected = false;
            }
          });

          initialGroupSelections[group.GroupId] = allStudentsSelected;
          if (!allStudentsSelected) {
            allGroupsSelected = false;
          }
        });

        initialCourseSelections[course.CourseId] = allGroupsSelected;
      });

      setSelectedStudents(initialStudentSelections);
      setSelectedGroups(initialGroupSelections);
      setSelectedCourses(initialCourseSelections);
    }
  }, [isOpened, courses]);

  const handleStudentSelect = (courseId, groupId, studentId, checked) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: checked
    }));

    updateGroupSelection(courseId, groupId, studentId, checked);
  };

  const updateGroupSelection = (courseId, groupId, studentId, checkedStatus) => {
    const course = courses.find(c => c.CourseId === courseId);
    const group = course?.Groups.find(g => g.GroupId === groupId);

    if (group) {
      // Create updated student selection state with the new change
      const updatedStudentSelections = {
        ...selectedStudents,
        [studentId]: checkedStatus
      };

      // Check if all students in this group are now selected
      const allStudentsSelected = group.Students.every(
        student => updatedStudentSelections[student.StudentId]
      );

      // Update group selection based on students' selection
      setSelectedGroups(prev => {
        const updatedGroupSelections = {
          ...prev,
          [groupId]: allStudentsSelected
        };

        // Now update course selection based on new group selections
        updateCourseSelection(courseId, updatedGroupSelections);

        return updatedGroupSelections;
      });
    }
  };

  const updateCourseSelection = (courseId, updatedGroupSelections = selectedGroups) => {
    const course = courses.find(c => c.CourseId === courseId);

    if (course) {
      const allGroupsSelected = course.Groups.every(
        group => updatedGroupSelections[group.GroupId]
      );

      setSelectedCourses(prev => ({
        ...prev,
        [courseId]: allGroupsSelected
      }));
    }
  };

  const handleGroupSelect = (courseId, groupId, checked) => {
    setSelectedGroups(prev => {
      const updatedGroups = {
        ...prev,
        [groupId]: checked
      };

      updateCourseSelection(courseId, updatedGroups);

      return updatedGroups;
    });

    const course = courses.find(c => c.CourseId === courseId);
    const group = course?.Groups.find(g => g.GroupId === groupId);

    if (group) {
      setSelectedStudents(prev => {
        const updatedStudents = { ...prev };
        group.Students.forEach(student => {
          updatedStudents[student.StudentId] = checked;
        });
        return updatedStudents;
      });
    }
  };

  const handleCourseSelect = (courseId, checked) => {
    setSelectedCourses(prev => ({
      ...prev,
      [courseId]: checked
    }));

    const course = courses.find(c => c.CourseId === courseId);

    if (course) {
      setSelectedGroups(prev => {
        const updatedGroups = { ...prev };
        course.Groups.forEach(group => {
          updatedGroups[group.GroupId] = checked;
        });
        return updatedGroups;
      });

      setSelectedStudents(prev => {
        const updatedStudents = { ...prev };
        course.Groups.forEach(group => {
          group.Students.forEach(student => {
            updatedStudents[student.StudentId] = checked;
          });
        });
        return updatedStudents;
      });
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleSave = () => {
    const selectedStudentIds = Object.keys(selectedStudents).filter(
      id => selectedStudents[id]
    );
    
    console.log("materialId: ", materialId);
    console.log("Выбранные StudentId:", selectedStudentIds);
    
    axios.put(`http://localhost:4000/api/materials/setAccessToMaterial/${materialId}`, selectedStudentIds)
      .then(response => {
        console.log("Access updated successfully:", response.data);
        onClose();
      })
      .catch(error => {
        console.error("Error updating access:", error);
      });
  };

  if (!isOpened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl transform transition-all z-50">
        {/* Заголовок модального окна */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#120c38] font-['Nunito']">Керування доступом до навчальних матеріалів</h3>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#120c38" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Содержимое модального окна */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.CourseId} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Заголовок курса */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCourse(course.CourseId)}
                  >
                    <div className="flex items-center">
                      <div className="transform transition-transform">
                        {expandedCourses[course.CourseId] ? (
                          <svg width="24" height="24" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23 27.7917V28.75M23 28.75L34.5 17.25M23 28.75L11.5 17.25" stroke="#120C38" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.7917 23L28.75 23M28.75 23L17.25 11.5M28.75 23L17.25 34.5" stroke="#8A48E6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-[#120c38] font-bold font-['Nunito'] ml-3">{course.CourseName}</h3>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCourses[course.CourseId] || false}
                        onChange={(e) => handleCourseSelect(course.CourseId, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 text-[#8a48e6] focus:ring-[#8a48e6]"
                      />
                    </div>
                  </div>

                  {/* Группы */}
                  {expandedCourses[course.CourseId] && (
                    <div className="p-4 pt-0 bg-gray-50">
                      {course.Groups.map(group => (
                        <div key={group.GroupId} className="ml-6 mt-3 border-l border-gray-200 pl-4">
                          {/* Заголовок группы */}
                          <div
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => toggleGroup(group.GroupId)}
                          >
                            <div className="flex items-center">
                              <div className="transform transition-transform">
                                {expandedGroups[group.GroupId] ? (
                                  <svg width="20" height="20" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 27.7917V28.75M23 28.75L34.5 17.25M23 28.75L11.5 17.25" stroke="#120C38" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.7917 23L28.75 23M28.75 23L17.25 11.5M28.75 23L17.25 34.5" stroke="#8A48E6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <h4 className="text-[#120c38] font-['Nunito'] font-semibold ml-2">{group.GroupName}</h4>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedGroups[group.GroupId] || false}
                                onChange={(e) => handleGroupSelect(course.CourseId, group.GroupId, e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-gray-300 text-[#8a48e6] focus:ring-[#8a48e6]"
                              />
                            </div>
                          </div>

                          {/* Ученики */}
                          {expandedGroups[group.GroupId] && (
                            <div className="ml-6 mt-2">
                              {group.Students.map(student => (
                                <div
                                  key={student.StudentId}
                                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                >
                                  <div className="flex items-center ml-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-[#120c38] text-sm font-['Mulish'] ml-2">{student.LastName} {student.FirstName}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedStudents[student.StudentId] || false}
                                      onChange={(e) => handleStudentSelect(course.CourseId, group.GroupId, student.StudentId, e.target.checked)}
                                      className="w-4 h-4 rounded border-gray-300 text-[#8a48e6] focus:ring-[#8a48e6]"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#827ead] font-['Mulish']">
              Нет доступных курсов
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-[#8a48e6] text-white px-6 py-2 rounded-full flex items-center font-bold font-['Nunito'] hover:bg-purple-700 stroke-white transition-colors"
          >
            <span>Зберегти</span>
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}