import React from "react";
import { useTranslation } from "react-i18next";

const LatestActivity = ({ activities }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[20px] mb-4 sm:mb-6 shadow-md h-[280px] overflow-y-auto relative">
      <h2
        className="text-[#120c38] text-base sm:text-lg md:text-xl font-bold font-['Nunito'] leading-normal tracking-[-0.5%] sticky top-0 bg-white z-10 w-full py-2 sm:py-4 p-3 sm:p-4"
      >
        {t("HomeTeacher.LatestActivity.title")}
      </h2>
      <ul className="px-2 sm:px-4">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <li key={index} className="mb-2 sm:mb-3">
              <div className="w-full mx-auto h-[50px] sm:h-[60px] relative">
                <div className="w-full h-full absolute bg-white rounded-[5px] top-0 left-0" />
                <img
                  className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] absolute left-[10px] top-[12px] rounded-full"
                  src={activity.image || `https://ui-avatars.com/api/?name=${activity.name}&background=random&size=86`}
                  alt={t("HomeTeacher.LatestActivity.activity_alt")}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${activity.name}&background=random&size=86`;
                  }}
                />
                <div
                  className="absolute left-[42px] sm:left-[55px] top-[5px] text-[#827ead] text-[10px] sm:text-[12px] font-normal font-['Mulish']"
                >
                  {activity.date}
                </div>
                <div
                  className="absolute left-[42px] sm:left-[55px] top-[18px] sm:top-[20px] text-[#120c38] text-xs sm:text-sm md:text-base font-bold font-['Nunito'] truncate max-w-[calc(100%-50px)]"
                >
                  {activity.name}
                </div>
                <div
                  className="absolute left-[42px] sm:left-[55px] top-[34px] sm:top-[40px] flex items-center gap-1 sm:gap-2 text-[#827ead] text-[9px] sm:text-[12px] font-normal font-['Mulish']"
                >
                  <span className="truncate max-w-[80px] sm:max-w-none">{activity.subject}</span>
                  <span>-</span>
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {t(`HomeTeacher.LatestActivity.types.${activity.type}`) || activity.type}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <div
            className="text-sm sm:text-base p-2"
            style={{ fontFamily: "Mulish", letterSpacing: "-0.5%", color: "#120C38" }}
          >
            {t("HomeTeacher.LatestActivity.no_data")}
          </div>
        )}
      </ul>
    </div>
  );
};

export default LatestActivity;