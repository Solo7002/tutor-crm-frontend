import React, { useState, useEffect } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import axios from 'axios';

const CourseModal = ({ isOpen, onClose, token,teacherId }) => {
  const [courseName, setCourseName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:4000/api/subjects/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setErrors({ fetch: 'Не вдалося завантажити предмети' });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen, token]);

  const handleSubjectSelect = (subjectName) => {
    const selectedSubject = subjects.find(subject => subject.SubjectName === subjectName);
    setSelectedSubjectId(selectedSubject?.SubjectId || null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!courseName.trim()) newErrors.courseName = 'Назва курсу є обов\'язковою';
    if (!selectedSubjectId) newErrors.subject = 'Виберіть предмет';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/courses/',
        {
          CourseName: courseName,
          SubjectId: selectedSubjectId,
          TeacherId:teacherId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Course created:', response.data);
      setCourseName('');
      setSelectedSubjectId(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({ submit: 'Не вдалося створити курс' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="w-[460px] h-auto p-6 relative bg-white rounded-[20px]">
        {isLoading && <div className="text-center">Завантаження...</div>}

        <div className="w-96 h-14 p-4 mb-4 bg-white rounded-2xl outline outline-1 outline-[#d7d7d7] flex items-center">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Назва курсу"
            className="flex-1 text-[#827ead] text-base font-normal font-['Mulish'] outline-none"
            disabled={isLoading}
          />
        </div>
        {errors.courseName && <p className="text-red-500 text-sm mb-4">{errors.courseName}</p>}
        {errors.fetch && <p className="text-red-500 text-sm mb-4">{errors.fetch}</p>}

        <div className="mb-4">
          <Dropdown
            textAll="Виберіть предмет"
            options={subjects.map(subject => ({ SubjectName: subject.SubjectName }))}
            onSelectSubject={handleSubjectSelect}
            disabled={isLoading}
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center disabled:opacity-50"
          disabled={isLoading}
        >
          <span className="text-white text-xl font-medium font-['Nunito']">
            {isLoading ? 'Створення...' : 'Додати курс'}
          </span>
        </button>

        {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CourseModal;