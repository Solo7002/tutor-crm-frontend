import React from 'react';

const NearestEvents = ({ events }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[25vh] overflow-y-auto">
      {/* Header */}
      <h2
        className="text-lg font-semibold mt-1 mb-3"
        style={{
          fontFamily: "Nunito",
          fontWeight: "700",
          fontSize: "20pt",
          lineHeight: "20.74px",
          letterSpacing: "-0.5%",
          color: "#120C38",
        }}
      >
        Найближчі події
      </h2>

      {/* List Events */}
      <ul>
        {events.map((event, index) => (
          <li key={index} className="mb-2">
            <div
              className="w-[100%] mx-auto h-[60px] relative"
            >
              {/* Background */}
              <div
                className="w-full h-full absolute bg-white rounded-[5px] shadow-[0px_1px_4px_0px_rgba(138,74,230,0.20)]"
                style={{ left: 0, top: 0 }}
              />

              {/* Event Image */}
              <img
                className="w-[35px] h-[35px] left-[10px] top-[12px] absolute rounded-full"
                src={event.image || "/assets/images/avatar.jpg"}
                alt={`${event.title} avatar`}
              />

              {/* Event Title */}
              <div
                className="left-[55px] top-[8px] absolute text-[#120c38] text-base font-bold font-['Nunito']"
                style={{ fontSize: "18px" }}
              >
                {event.title}
              </div>

              {/* Event Time */}
              <div
                className="left-[55px] top-[30px] absolute text-[#827ead] text-sm font-normal font-['Mulish']"
                style={{ fontSize: "12px" }}
              >
                {event.date} {event.time}
              </div>

              {/* Button */}
              <div
                className="w-[90px] h-[35px] px-4 py-2 right-[10px] top-[12px] absolute rounded-[40px] border border-[#8a48e6] justify-center items-center gap-2.5 inline-flex cursor-pointer"
                onClick={() => window.open(event.link, '_blank')}
              >
                <div
                  className="text-[#8a48e6] text-sm font-normal font-['Mulish']"
                  style={{ fontSize: "14px" }}
                >
                  Перейти
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearestEvents;