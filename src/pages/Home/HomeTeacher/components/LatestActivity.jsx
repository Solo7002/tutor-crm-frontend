import React from "react";

const LatestActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-[20px] mb-6 shadow-md h-[30vh] overflow-y-auto relative">
      {/* Header */}
      <h2 className="text-[#120c38] text-[20pt] font-bold font-['Nunito'] leading-[20.74px] tracking-[-0.5%] sticky top-0 bg-white z-10 w-full py-4 p-4">
        Останні активності
      </h2>

      {/* List Activities */}
      <ul className="px-4">
        {activities.map((activity, index) => (
          <li key={index} className="mb-3">
            <div className="w-full mx-auto h-[60px] relative">
              {/* Background (без тени) */}
              <div className="w-full h-full absolute bg-white rounded-[5px] top-0 left-0" />

              {/* Activity Image */}
              <img
                className="w-[35px] h-[35px] absolute left-[10px] top-[12px] rounded-full"
                src={activity.image || `https://ui-avatars.com/api/?name=${activity.name}&background=random&size=86`}
                alt={`${activity.type} icon`}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${activity.name}&background=random&size=86`;
                }}
              />

              {/* Activity Details */}
              <div className="absolute left-[55px] top-[5px] text-[#827ead] text-[12px] font-normal font-['Mulish']">
                {activity.date}
              </div>
              <div className="absolute left-[55px] top-[20px] text-[#120c38] text-[18px] font-bold font-['Nunito']">
                {activity.name}
              </div>
              <div className="absolute left-[55px] top-[40px] flex items-center gap-2 text-[#827ead] text-[12px] font-normal font-['Mulish']">
                <span>{activity.subject}</span>
                <span>-</span>
                <span>{activity.type}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestActivity;