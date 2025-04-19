import { useState } from 'react';

const GroupItem = ({ group, groupIndex, deleteGroup, onChange, editedGroup }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const students = (group.Students || []).map(student => student.User).filter(Boolean);

  const validateGroupName = (value) => {
    return !value || value.trim() === '' ? 'Назва групи не може бути порожньою' : '';
  };

  const validateGroupPrice = (value) => {
    if (!value && value !== '0') return 'Ціна не може бути порожньою';
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 'Ціна має бути числом >= 0' : '';
  };

  const validateForm = () => {
    const newErrors = {
      GroupName: validateGroupName(editedGroup.GroupName),
      GroupPrice: validateGroupPrice(editedGroup.GroupPrice),
    };
    setErrors(newErrors);
    setTouched({ GroupName: true, GroupPrice: true });
    return Object.values(newErrors).every(error => error === '');
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let error = '';
    switch (field) {
      case 'GroupName':
        error = validateGroupName(value);
        break;
      case 'GroupPrice':
        error = validateGroupPrice(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (validateForm()) {
      setIsEditing(false);
      setTouched({});
      setErrors({});
    }
  };

  const handleDeleteStudent = (studentId, groupId) => {
    console.log("delete student " + studentId + " from group " + groupId);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
      {/* Group Header */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between p-4 cursor-pointer bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-medium mr-4">
            {groupIndex + 1}
          </div>
          <h3 className="text-lg font-semibold">
            {editedGroup.GroupName || 'Нова група'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span className="text-gray-600">{editedGroup.studentCount || 0}</span>
          </div>

          <div className="flex items-center">
            <span className="text-gray-600">{editedGroup.GroupPrice || 0} грн</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) {
                handleSave(e);
              } else {
                setIsEditing(true);
              }
            }}
            className="px-3 py-1 bg-purple-200 text-[#120C38] rounded-md hover:bg-purple-300 transition-colors"
          >
            {isEditing ? 'Зберегти' : 'Редагувати'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Ви впевнені, що хочете видалити цю групу?')) {
                deleteGroup(groupIndex);
              }
            }}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Видалити
          </button>

          <button
            className="ml-2 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Group Content (Expanded) */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва групи</label>
                <input
                  type="text"
                  value={editedGroup.GroupName || ''}
                  onChange={(e) => onChange(groupIndex, 'GroupName', e.target.value)}
                  onBlur={() => handleBlur('GroupName', editedGroup.GroupName)}
                  className={`w-full p-3 rounded-lg border ${errors.GroupName && touched.GroupName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="Введіть назву групи"
                />
                {touched.GroupName && errors.GroupName && (
                  <span className="text-red-500 text-sm mt-1">{errors.GroupName}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ціна</label>
                <input
                  type="number"
                  min={0}
                  value={editedGroup.GroupPrice || ''}
                  onChange={(e) => onChange(groupIndex, 'GroupPrice', e.target.value)}
                  onBlur={() => handleBlur('GroupPrice', editedGroup.GroupPrice)}
                  className={`w-full p-3 rounded-lg border ${errors.GroupPrice && touched.GroupPrice ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="Введіть ціну"
                />
                {touched.GroupPrice && errors.GroupPrice && (
                  <span className="text-red-500 text-sm mt-1">{errors.GroupPrice}</span>
                )}
              </div>
            </div>
          ) : null}

          {/* Students Table */}
          <div className="mt-4">
            <h4 className="font-medium text-lg mb-3">Учні групи</h4>

            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ім'я
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.UserId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={student.ImageFilePath ? student.ImageFilePath : `https://ui-avatars.com/api/?name=${student.FirstName + ' ' + student.LastName}&background=random&size=86`}
                                alt={`${student.FirstName} ${student.LastName}`}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.LastName} {student.FirstName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <div className="text-sm text-gray-500">{student.Email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleDeleteStudent(student.UserId, editedGroup.GroupId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                У цій групі поки немає учнів
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupItem;