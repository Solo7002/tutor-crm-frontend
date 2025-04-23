import React from "react";
import { Link } from "react-router-dom";

const NearestEvents = ({ events }) => {
  return (
    <div className="bg-white rounded-[20px] shadow-md h-[25vh] overflow-y-auto events relative">
      {/* Header */}
      <h2
        className="text-[#120c38] font-semibold sticky top-0 bg-white z-10 w-full py-4 px-4"
        style={{
          fontFamily: "Nunito",
          fontWeight: "700",
          fontSize: "20pt",
          lineHeight: "20.74px",
          letterSpacing: "-0.5%",
        }}
      >
        Найближчі події
      </h2>

      {/* List Container */}
      <div className="px-4 pb-4">
        <ul>
          {
            events.length > 0 ?
              events.map((event, index) => (
                <li key={index} className="mb-2">
                  <div className="w-full mx-auto h-[60px] relative">
                    {/* Background */}
                    <div
                      className="w-full h-full absolute bg-white rounded-[5px] shadow-[0px_1px_4px_0px_rgba(138,74,230,0.20)]"
                      style={{ left: 0, top: 0 }}
                    />

                    {/* Event Image */}
                    <img
                      className="w-[35px] h-[35px] left-[10px] top-[12px] absolute rounded-full"
                      src={event.image || `https://ui-avatars.com/api/?name=${event.title}&background=random&size=86`}
                      alt={`${event.title} avatar`}
                    />

                    {/* Event Title */}
                    <div
                      className="left-[42px] sm:left-[55px] top-[7px] sm:top-[8px] absolute text-[#120c38] text-xs sm:text-sm md:text-base font-bold font-['Nunito'] truncate max-w-[calc(100%-150px)]"
                    >
                      {event.title}
                    </div>

                    {/* Event Time */}
                    <div
                      className="left-[55px] top-[30px] absolute text-[#827ead] text-[12px] font-normal font-['Mulish']"
                    >
                      {event.date} {event.time}
                    </div>

                    {/* Button */}

                    <Link to="/student/calendar">
                      <div
                        className="w-[90px] h-[35px] px-4 py-2 right-[10px] top-[12px] absolute rounded-[40px] border border-[#8a48e6] justify-center items-center gap-2.5 inline-flex cursor-pointer"
                      >
                        <div className="text-[#8a48e6] text-[14px] font-normal font-['Mulish']">
                          Перейти
                        </div>
                      </div>
                    </Link>
                  </div>
                </li>
              ))
              :
              <div
                style={{
                  fontFamily: "Mulish",
                  fontSize: "15pt",
                  lineHeight: "18.83pt",
                  letterSpacing: "-0.5%",
                  color: "#120C38",
                }}
              >
                Немає інформації
              </div>}
        </ul>
      </div>
    </div>
  );
};

export default NearestEvents;