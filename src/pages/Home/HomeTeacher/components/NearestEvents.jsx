import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NearestEvents = ({ events = [] }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-[20px] shadow-md h-[265px] overflow-y-auto events relative">
            <h2
                className="text-[#120c38] font-semibold sticky top-0 bg-white z-10 w-full py-2 sm:py-4 px-3 sm:px-4 text-base sm:text-lg md:text-xl"
                style={{
                    fontFamily: "Nunito",
                    fontWeight: "700",
                    lineHeight: "1.35",
                    letterSpacing: "-0.5%",
                }}
            >
                {t("HomeTeacher.NearestEvents.title")}
            </h2>
            <div className="px-2 sm:px-4 pb-4">
                <ul>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <li key={index} className="mb-2">
                                <div className="w-full mx-auto h-[50px] sm:h-[60px] relative">
                                    <div className="w-full h-full absolute bg-white rounded-[5px] shadow-[0px_1px_4px_0px_rgba(138,74,230,0.20)]" />
                                    <img
                                        className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] left-[10px] top-[12px] absolute rounded-full"
                                        src={
                                            event.image ||
                                            `https://ui-avatars.com/api/?name=${event.title}&background=random&size=86`
                                        }
                                        alt={t("HomeTeacher.NearestEvents.event_alt")}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${event.title}&background=random&size=86`;
                                        }}
                                    />
                                    <div
                                        className="left-[42px] sm:left-[55px] top-[7px] sm:top-[8px] absolute text-[#120c38] text-xs sm:text-sm md:text-base font-bold font-['Nunito'] truncate max-w-[calc(100%-150px)]"
                                    >
                                        {event.title}
                                    </div>
                                    <div
                                        className="left-[42px] sm:left-[55px] top-[25px] sm:top-[30px] absolute text-[#827ead] text-[10px] sm:text-[12px] font-normal font-['Mulish']"
                                    >
                                        {event.date} {event.time}
                                    </div>
                                    <Link to="/teacher/calendar">
                                        <div className="h-[28px] sm:h-[35px] px-2 sm:px-4 py-1 sm:py-2 right-[10px] top-[10px] sm:top-[12px] absolute rounded-[40px] border border-[#8a48e6] justify-center items-center gap-1 sm:gap-2.5 inline-flex cursor-pointer">
                                            <div className="text-[#8a48e6] text-[12px] sm:text-[14px] font-normal font-['Mulish']">
                                                {t("HomeTeacher.NearestEvents.go_to")}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div
                            className="text-sm sm:text-base"
                            style={{
                                fontFamily: "Mulish",
                                letterSpacing: "-0.5%",
                                color: "#120C38",
                            }}
                        >
                            {t("HomeTeacher.NearestEvents.no_data")}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NearestEvents;