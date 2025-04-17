import React from "react";

const UserCard = ({ type, doneHometask, student, MaxMark, openModalHandler }) => {
  const getOutlineColor = () => {
    switch (type) {
      case "check":
        return "#8a48e6";
      case "done":
        if (doneHometask.Mark / MaxMark < 0.33) return "#e64851";
        if (doneHometask.Mark / MaxMark < 0.66) return "#ffa869";
        else return "#47c974";
      case "not_done":
        return "#d7d7d7";
      default:
        return "#d7d7d7";
    }
  };

  const getButtonBgColor = () => {
    switch (type) {
      case "check":
        return "#ffffff";
      case "done":
        if (doneHometask.Mark / MaxMark < 0.33) return "#e64851";
        if (doneHometask.Mark / MaxMark < 0.66) return "#ffa869";
        else return "#47c974";
      case "not_done":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "check":
        return "#8a48e6";
      case "done":
        return "#ffffff";
      case "not_done":
        return "#d7d7d7";
      default:
        return "#d7d7d7";
    }
  };

  const getText = () => {
    switch (type) {
      case "check":
        return "Перевірити";
      case "done":
        return `${doneHometask.Mark}/${MaxMark}`;
      case "not_done":
        return "Не виконано";
      default:
        return "";
    }
  };

  return (
    <div
      className="w-[400px] h-[86px] relative rounded-3xl outline outline-1 outline-offset-[-1px] overflow-hidden"
      style={{ outlineColor: getOutlineColor() }}
    >
      <img
        className="w-[84px] h-[84px] left-[1px] top-[1px] absolute rounded-[23.3px]"
        src={student.ImageFilePath || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.LastName + ' ' + student.FirstName)}&background=random&size=86`}
        alt="Student avatar"
      />
      <div className="left-[101px] top-[18px] absolute justify-center text-[#120c38] text-[15px] font-normal font-['Mulish']">
        {student.LastName + " " + student.FirstName}
      </div>
      <div className="w-[143px] left-[101px] top-[51px] absolute justify-center text-[#827ead] text-[15px] font-bold font-['Nunito']">
        {type !== "not_done" ? new Date(doneHometask.DoneDate).toLocaleDateString("ru-RU") : "Не відправлено"}
      </div>
      {type==="check"? <div
        className="w-[130px] h-10 px-4 py-2 left-[260px] top-[23px] absolute rounded-[40px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5 bg-white hover:bg-purple-600 cursor-pointer text-[#8a48e6] hover:text-white"
        style={{ outlineColor: getOutlineColor()}}
      >
        <div className="justify-start text-[15px] font-bold font-['Nunito']" onClick={openModalHandler}>
          Перевірити
        </div>
      </div> : <div
        className="w-[130px] h-10 px-4 py-2 left-[260px] top-[23px] absolute rounded-[40px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5"
        style={{ outlineColor: getOutlineColor(), backgroundColor: getButtonBgColor()}}
      >
        <div className="justify-start text-[15px] font-bold font-['Nunito']" style={{ color: getTextColor() }}>
          {getText()}
        </div>
      </div>}
    </div>
  );
};

export default UserCard;