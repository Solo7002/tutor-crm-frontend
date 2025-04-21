import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, BookOpen, Loader2 } from 'lucide-react';

const CourseModal = ({ isOpen, onClose, token, teacherId }) => {
  const [courseName, setCourseName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      setCourseName('');
      setSelectedSubjectId(null);
      setSelectedSubjectName('');
      setErrors({});
    }
  }, [isOpen, token]);

  const validateForm = () => {
    const newErrors = {};
    if (!courseName.trim()) newErrors.courseName = 'Назва курсу є обов\'язковою';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/courses/',
        {
          CourseName: courseName,
          SubjectName: courseName,
          TeacherId: teacherId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({ submit: 'Не вдалося створити курс' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('subject-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#120C38] font-[Nunito]">Додавання нового курсу</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-full p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-gray-600">Завантаження...</span>
          </div>
        )}

        {!isLoading && (
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                  Назва курсу
                </label>
                <div className={`relative rounded-xl border ${errors.courseName ? 'border-red-300 focus-within:border-red-500' : 'border-gray-300 focus-within:border-purple-500'} focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50 transition-all`}>
                  <input
                    id="courseName"
                    type="text"
                    value={courseName}
                    onChange={(e) => {
                      setCourseName(e.target.value);
                      if (errors.courseName) {
                        setErrors({ ...errors, courseName: null });
                      }
                    }}
                    placeholder="Введіть назву курсу"
                    className="w-full px-4 py-3 text-gray-700 bg-transparent outline-none rounded-xl"
                    disabled={isSubmitting}
                  />
                  <BookOpen className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.courseName && (
                  <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>
                )}
              </div>

              {errors.fetch && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.fetch}
                </div>
              )}
              
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-[#8A48E6] hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-xl shadow-md flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Створення...
                  </>
                ) : (
                  'Додати курс'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseModal;