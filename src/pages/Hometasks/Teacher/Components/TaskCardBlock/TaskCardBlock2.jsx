import React from "react";
import axios from "axios";

const TaskCardBlock2 = React.forwardRef(({ isSelected, onSelect, hometask }, ref, ) => {
  return (
    <div
      ref={ref}
      className="task-block-card no-select flex-shrink-0 cursor-pointer w-[420px] p-[15px] relative bg-gradient-to-l rounded-3xl outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-4 mr-6"
      style={{
        backgroundImage: "linear-gradient(to top right, white, transparent)",
        outlineColor: isSelected ? "#8a48e6" : "#d7d7d7",
        outlineWidth: isSelected ? 2 : 1,
      }}
      onClick={onSelect}
    >
      <div className="inline-flex flex-col justify-end items-start gap-[7px]">
        <div className="self-stretch justify-start text-[#120c38] text-xl font-normal font-['Mulish'] mb-2">
          {hometask.HometaskHeader}
        </div>
        <div className="inline-flex justify-start items-center gap-1.5">
          <div className="h-[37px] flex justify-start items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z"
                stroke="#827FAE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="justify-center">
              <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                Видано:
                <br />
              </span>
              <span className="text-[#120c38] text-[15px] font-extrabold font-['Lato']">
                {new Date(hometask.HometaskStartDate).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
          <div className="h-[37px] flex justify-start items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 6.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                stroke="#827FAE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="justify-center">
              <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                Виконати до:
                <br />
              </span>
              <span className="text-[#8a48e6] text-[15px] font-extrabold font-['Lato']">
              {new Date(hometask.HometaskDeadlineDate).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <img
        className="no-select-img flex-1 w-[131px] h-[124px] rounded-3xl object-fill"
        src={hometask.HometaskCover || "https://placehold.co/131x124"}
        draggable="false"
        alt="Task preview"
      />
      <div
        className="px-2.5 py-[5px] right-0 top-0 absolute rounded-tr-3xl rounded-bl-3xl outline outline-1 outline-offset-[-1px] flex justify-end items-center gap-2.5"
        style={{
          backgroundColor: isSelected ? "#8a48e6" : "white",
          outlineColor: isSelected ? "#8a48e6" : "#d7d7d7",
          color: isSelected ? "white" : "#827fae",
          outlineWidth: isSelected ? 2 : 1,
        }}
      >
        <div className="text-center justify-center text-[15px] font-bold font-['Nunito']">
          {`${hometask.DoneHometasks.length}/${hometask.DoneHometasks.length + hometask.NotDoneHometaskStudents.length}`}
        </div>
      </div>
    </div>
  );
});

export default TaskCardBlock2;