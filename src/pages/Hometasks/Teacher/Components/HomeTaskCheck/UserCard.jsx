import React from "react";

const UserCard = ({ 
  type = "not_done", 
  doneHometask = {}, 
  student = {}, 
  MaxMark = 100, 
  openModalHandler,
  className = "",
  dateFormat = "ru-RU"
}) => {
  const CARD_TYPES = {
    check: {
      outlineColor: "#8a48e6",
      bgColor: "#ffffff",
      textColor: "#8a48e6",
      buttonText: "Перевірити"
    },
    done: {
      getOutlineColor: (mark, max) => {
        const ratio = mark / max;
        if (ratio < 0.33) return "#e64851";
        if (ratio < 0.66) return "#ffa869";
        return "#47c974";
      },
      getBgColor: (mark, max) => {
        const ratio = mark / max;
        if (ratio < 0.33) return "#e64851";
        if (ratio < 0.66) return "#ffa869";
        return "#47c974";
      },
      textColor: "#ffffff",
      getButtonText: (mark, max) => `${mark}/${max}`
    },
    not_done: {
      outlineColor: "#d7d7d7",
      bgColor: "#ffffff",
      textColor: "#d7d7d7",
      buttonText: "Не виконано"
    }
  };

  const defaultType = CARD_TYPES.not_done;
  const cardType = CARD_TYPES[type] || defaultType;

  const getOutlineColor = () => {
    if (type === "done" && cardType.getOutlineColor) {
      return cardType.getOutlineColor(doneHometask.Mark, MaxMark);
    }
    return cardType.outlineColor;
  };

  const getButtonBgColor = () => {
    if (type === "done" && cardType.getBgColor) {
      return cardType.getBgColor(doneHometask.Mark, MaxMark);
    }
    return cardType.bgColor;
  };

  const getTextColor = () => cardType.textColor;

  const getText = () => {
    if (type === "done" && cardType.getButtonText) {
      return cardType.getButtonText(doneHometask.Mark, MaxMark);
    }
    return cardType.buttonText;
  };

  const getFormattedDate = () => {
    if (!doneHometask.DoneDate) return "Не відправлено";
    
    try {
      return new Date(doneHometask.DoneDate).toLocaleDateString(dateFormat);
    } catch (e) {
      return "Некорректная дата";
    }
  };

  const getAvatarUrl = () => {
    return student.ImageFilePath || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        (student.LastName || "") + " " + (student.FirstName || "")
      )}&background=random&size=86`;
  };

  const getFullName = () => {
    return `${student.LastName || ""} ${student.FirstName || ""}`.trim() || "Имя не указано";
  };

  return (
    <div
      className={`w-full max-w-[400px] relative rounded-3xl outline outline-1 outline-offset-[-1px] overflow-hidden flex items-center ${className}`}
      style={{
        outlineColor: getOutlineColor(),
        height: "86px"
      }}
    >
      <div className="flex-shrink-0 absolute left-0 top-0 bottom-0">
        <img
          className="h-full w-[86px] rounded-3xl object-cover"
          style={{
            marginLeft: "1px",
            marginTop: "1px",
            marginBottom: "1px",
            height: "calc(100% - 2px)"
          }}
          src={getAvatarUrl()}
          alt={`${getFullName()} avatar`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://ui-avatars.com/api/?name=Error&background=e74c3c&size=86";
          }}
        />
      </div>
      
      <div className="flex flex-grow min-w-0 ml-[101px] mr-2">
        <div className="flex flex-col justify-center min-w-0 flex-grow pr-2 md:pr-4">
          <div className="text-[#120c38] text-[15px] font-normal font-['Mulish'] truncate max-w-full">
            {getFullName()}
          </div>
          <div className="text-[#827ead] text-[15px] font-bold font-['Nunito'] truncate mt-[13px] max-w-full">
            {type !== "not_done" ? getFormattedDate() : "Не відправлено"}
          </div>
        </div>
        
        <div className="flex items-center flex-shrink-0">
          {type === "check" ? (
            <div
              onClick={openModalHandler}
              className="px-4 py-2 rounded-[40px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5 bg-white hover:bg-purple-600 cursor-pointer text-[#8a48e6] hover:text-white transition-colors duration-200 w-32 lg:w-32 md:w-24 sm:w-20"
              style={{
                outlineColor: getOutlineColor(),
                height: "40px"
              }}
            >
              <div className="text-[15px] font-bold font-['Nunito'] whitespace-nowrap overflow-hidden text-ellipsis">
                {getText()}
              </div>
            </div>
          ) : (
            <div
              className="px-4 py-2 rounded-[40px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5 w-32 lg:w-32 md:w-24 sm:w-20"
              style={{
                outlineColor: getOutlineColor(),
                backgroundColor: getButtonBgColor(),
                height: "40px"
              }}
            >
              <div className="text-[15px] font-bold font-['Nunito'] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: getTextColor() }}>
                {getText()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div> 
  );
};

export default UserCard;