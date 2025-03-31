import React from 'react';
import FilterButtons from './FilterButton';
import UserCard from './UserCard';

const MainComponent = () => {
  return (
    <div className="h-screen overflow-y-auto p-5 bg-white rounded-t-3xl border border-[#d7d7d7] mx-auto mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <FilterButtons />
        <button className="w-10 h-10 rounded-full bg-white flex justify-center items-center mt-2 sm:mt-0">
          <div className="w-5 h-5 border-2 border-[#120c38] rounded-full" />
        </button>
      </div>
      <hr className="border-t border-[#d7d7d7] mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1260px] mx-auto">
        <UserCard name="Щупальцева Михайлівна" date="01.03.2025" />
        <UserCard name="Марина Олександрівна" date="01.03.2025" />
        <UserCard name="Дмитро Сергійович" date="01.03.2025" />
        <UserCard name="Олена Ігорівна" date="01.03.2025" />
        <UserCard name="Артем Віталійович" date="01.03.2025" />
      </div>
    </div>
  );
};

export default MainComponent;