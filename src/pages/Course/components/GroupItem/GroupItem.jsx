import React from 'react';

const GroupItem = ({ group, groupIndex, deleteGroup, onChange, editedGroup }) => {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-4">
       <div className="w-12 h-12 flex items-center justify-center rounded-full  font-medium">
            {groupIndex + 1}
          </div>
          
        
          <div className="flex-1">
            <input
              type="text"
              value={editedGroup.GroupName || ''}
              onChange={(e) => onChange(groupIndex, 'GroupName', e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-200 text-gray-700"
              placeholder="Назва групи"
            />
          </div>
          
         
          <div className="w-36">
            <div className="relative">
              <input
                value={editedGroup.studentCount || 0}
                readOnly={true}
                className="w-full p-4 rounded-lg border border-gray-200 text-gray-700 text-center"
                placeholder="Кількість учнів"
              />
            </div>
          </div>
          
   
          <div className="w-36">
            <div className="relative">
              <input
                type="number"
                min={0}
                value={editedGroup.GroupPrice || ''}
                onChange={(e) => onChange(groupIndex, 'GroupPrice', e.target.value)}
                className="w-full p-4 rounded-lg border border-gray-200 text-gray-700 text-center"
                placeholder="Ціна"
              />
            </div>
          </div>
          
          
          <button
            onClick={() => deleteGroup(groupIndex)}
            className="px-5 py-3 rounded-[40px] outline outline-1 bg-white text-black font-semibold hover:bg-gray-50"
            aria-label="Видалити групу"
          >
            Видалити
          </button>
        </div>
      </div>
    );
  };
  
  export default GroupItem;