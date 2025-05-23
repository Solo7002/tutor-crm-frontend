import React from "react";
import { useTranslation } from "react-i18next";
import "./Hometask-card.css";

export const StatusButton = ({ status, mark, maxmark, onClick, disabled = false, children, svg, className, ...props }) => {
  const { t } = useTranslation();

  const statusColors = {
    overdue: "overdue",
    pending: "pending",
    done: "done",
    default: "default",
  };

  const defaultTexts = {
    overdue: t("HometaskStudent.components.HometaskCard.StatusButton.Send"),
    pending: t("HometaskStudent.components.HometaskCard.StatusButton.Cancel"),
    done: `${mark}/${maxmark}`,
    default: t("HometaskStudent.components.HometaskCard.StatusButton.Send"),
  };

  const getText = () => {
    return children || defaultTexts[status] || t("HometaskStudent.components.HometaskCard.StatusButton.Default");
  };

  const getSvg = () => {
    if (svg) return svg;

    if (status === "default" || status === "overdue") {
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-8 md:h-8 sm:w-6 sm:h-6">
          <path
            d="M28 16L6.264 5.37866C6.14001 5.33043 6.00442 5.3204 5.87469 5.34987C5.74495 5.37933 5.627 5.44694 5.536 5.54399C5.44267 5.64355 5.37841 5.76679 5.3502 5.90031C5.32199 6.03382 5.33092 6.17252 5.376 6.30132L8.66667 16M28 16L6.264 26.6213C6.14001 26.6695 6.00442 26.6796 5.87469 26.6501C5.74495 26.6206 5.627 26.553 5.536 26.456C5.44267 26.3564 5.37841 26.2332 5.3502 26.0997C5.32199 25.9662 5.33092 25.8275 5.376 25.6987L8.66667 16M28 16H8.66667"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    return null;
  };

  let styleStatus = status;
  if (status === "done" && maxmark > 0 && mark !== undefined && mark !== null) {
    const scoreRatio = mark / maxmark;
    if (scoreRatio < 0.33) {
      styleStatus = "Low";
    } else if (scoreRatio < 0.66) {
      styleStatus = "Medium";
    } else {
      styleStatus = "High";
    }
  }

  return (
    <button
      data-style-status={styleStatus}
      className={`rounded-3xl outline outline-1 justify-end items-center flex transition-all duration-300 ${
        styleStatus === "default"
          ? "bg-white text-[#8A48E6] outline-[#8A48E6] stroke-[#8A48E6] hover:bg-[#8A48E6] hover:text-white hover:stroke-white"
          : styleStatus === "overdue"
          ? "bg-white text-[#E64851] outline-[#E64851] stroke-[#E64851] hover:bg-[#E64851] hover:text-white hover:stroke-white"
          : styleStatus === "pending"
          ? "bg-white text-[#FFA869] outline-[#FFA869] stroke-[#FFA869] hover:bg-[#FFA869] hover:text-white hover:stroke-white"
          : styleStatus === "Low"
          ? "bg-[#ff0000] text-white outline-[#ff0000] hover:bg-white hover:text-[#ff0000] hover:outline-[#ff0000]"
          : styleStatus === "Medium"
          ? "bg-[#ffa869] text-white outline-[#ffa869] hover:bg-white hover:text-[#ffa869] hover:outline-[#ffa869]"
          : styleStatus === "High"
          ? "bg-[#47c974] text-white outline-[#47c974] hover:bg-white hover:text-[#44B56A] hover:outline-[#44B56A]"
          : "bg-white text-[#44B56A] outline-[#44B56A] hover:bg-white hover:text-[#44B56A] hover:outline-[#44B56A]"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <div className={`grow shrink basis-0 text-center text-base font-bold font-['Nunito'] md:text-base sm:text-sm`}>
        {getText()}
      </div>
      {getSvg() && (
        <div data-svg-wrapper className="flex items-center justify-center">
          {getSvg()}
        </div>
      )}
    </button>
  );
};

export const HomeTaskCardFull = ({
  status = "default",
  subject,
  title,
  issuedDate,
  dueDate,
  teacher,
  photoSrc,
  mark = 0,
  maxmark = 0,
  onClick,
}) => {
  const { t } = useTranslation();

  const statusColors = {
    overdue: "overdue",
    pending: "pending",
    done: "done",
    default: "default",
  };

  return (
    <div
      className="hometask-card relative pattern-bg"
      style={{
        backgroundImage: "linear-gradient(to top right, white, transparent)",
      }}
    >
      <div
        className={`w-full max-w-[420px] h-auto md:h-60 px-4 py-3 back-card bg-gradient-to-tr homework-status-${
          statusColors[status]
        } from-white to-emerald-30 rounded-3xl border flex flex-col md:flex-row justify-start items-start gap-4 overflow-hidden`}
      >
        <div className="w-full md:w-48 flex-col justify-start items-start gap-2 inline-flex">
          <div className="justify-start items-center gap-2 inline-flex">
            <div className="h-4 text-slate-400 text-base font-bold font-['Nunito']">{subject}</div>
          </div>
          <div className="self-stretch h-auto md:h-44 flex-col justify-start items-start gap-4 flex">
            <div
              className={`self-stretch h-auto md:h-20 text-slate-900 text-xl md:text-xl sm:text-lg font-normal font-['Nunito'] class-title`}
            >
              {title}
            </div>
            <div className="h-auto md:h-20 flex-col justify-center items-start md:items-end gap-1 flex w-full">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div data-svg-wrapper>
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-6 md:h-6 sm:w-5 sm:h-5"
                  >
                    <path
                      d="M16 3.5V7.5M8 3.5V7.5M4 11.5H20M7 14.5H7.013M10.01 14.5H10.015M13.01 14.5H13.015M16.015 14.5H16.02M13.015 17.5H13.02M7.01 17.5H7.015M10.01 17.5H10.015M4 7.5C4 6.96957 4.21071 6.46086 4.58579 6.08579C4.96086 5.71071 5.46957 5.5 6 5.5H18C18.5304 5.5 19.0391 5.71071 19.4142 6.08579C19.7893 6.46086 20 6.96957 20 7.5V19.5C20 20.0304 19.7893 20.5391 19.4142 20.9142C19.0391 21.2893 18.5304 21.5 18 21.5H6C5.46957 21.5 4.96086 21.2893 4.58579 20.9142C4.21071 20.5391 4 20.0304 4 19.5V7.5Z"
                      stroke="#827FAE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-400 text-base md:text-base sm:text-sm font-normal font-['Nunito'] info-text">
                    {t("HometaskStudent.components.HometaskCard.Issued")}
                    <br />
                  </span>
                  <span className="text-slate-900 font-bold font-['Nunito'] md:text-base sm:text-sm">{issuedDate}</span>
                </div>
              </div>
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <div data-svg-wrapper>
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-6 md:h-6 sm:w-5 sm:h-5"
                  >
                    <path
                      d="M15 14.5L12 12.5V7.5M3 12.5C3 13.6819 3.23279 14.8522 3.68508 15.9442C4.13738 16.5361 4.80031 17.5282 5.63604 18.864C6.47177 19.6997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21.5 12 21.5C13.1819 21.5 14.3522 21.2672 15.4442 20.8149C16.5361 20.3626 17.5282 19.6997 18.364 18.864C19.1997 18.0282 19.8626 17.0361 20.3149 15.9442C20.7672 14.8522 21 13.6819 21 12.5C21 11.3181 20.7672 10.1478 20.3149 9.05585C19.8626 7.96392 19.1997 6.97177 18.364 6.13604C17.5282 5.30031 16.5361 4.63738 15.4442 4.18508C14.3522 3.73279 13.1819 3.5 12 3.5C10.8181 3.5 9.64778 3.73279 8.55585 4.18508C7.46392 4.63738 6.47177 5.30031 5.63604 6.13604C4.80031 6.97177 4.13738 7.96392 3.68508 9.05585C3.23279 10.1478 3 11.3181 3 12.5Z"
                      stroke="#827FAE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-slate-400 text-base md:text-base sm:text-sm font-normal font-['Nunito'] info-text">
                    {status === "done"
                      ? t("HometaskStudent.components.HometaskCard.Done")
                      : t("HometaskStudent.components.HometaskCard.Due")}
                    <br />
                  </span>
                  <span
                    className={`text-base md:text-base sm:text-sm font-bold homework-status-${
                      statusColors[status]
                    } font-['Nunito']`}
                  >
                    {dueDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:flex-grow md:shrink md:basis-0 flex-col justify-center items-center md:items-end gap-2 inline-flex mt-4 md:mt-0">
          <div className="self-stretch h-6 text-right text-slate-400 text-base font-bold font-['Nunito']">{teacher}</div>
          <div className="self-stretch h-auto md:h-44 relative">
            <img
              alt={t("HometaskStudent.components.HometaskCard.ImageAlt")}
              className={`w-full md:w-44 h-40 object-cover rounded-tl-3xl rounded-tr-3xl`}
              src={photoSrc}
            />
            <StatusButton
              status={status}
              mark={mark}
              maxmark={maxmark}
              className={`w-full md:w-44 h-11 px-4 py-2 left-0 bottom-0 md:top-[135px] gap-5 ${
                status === "done" ? "absolute" : "mt-1 md:absolute"
              }`}
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeTaskCard = ({ status = "default", subject, title, issuedDate, dueDate, teacher, mark = 0, maxmark = 0, onClick }) => {
  const { t } = useTranslation();

  const statusColors = {
    overdue: "overdue",
    pending: "pending",
    done: "done",
    default: "default",
  };

  return (
    <div className="hometask-card">
      <div
        className={`w-full max-w-[408px] h-auto md:h-[184px] p-4 back-card bg-gradient-to-tr from-white to-emerald-30 rounded-3xl border flex-col justify-start items-start gap-3 inline-flex homework-status-${
          statusColors[status]
        }`}
      >
        <div className="self-stretch h-auto md:h-20 flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch flex justify-between items-center gap-2">
            <div className="h-6 text-slate-400 text-base md:text-base sm:text-sm font-bold font-['Nunito']">{subject}</div>
            <div className="text-right text-slate-400 text-base md:text-base sm:text-sm font-bold font-['Nunito']">{teacher}</div>
          </div>
          <div className="self-stretch text-slate-900 text-xl md:text-xl sm:text-lg font-normal font-['Nunito'] class-title">{title}</div>
        </div>
        <div className="self-stretch justify-between items-end flex-col md:flex-row flex md:inline-flex gap-3 md:gap-0">
          <div className="w-full md:w-48 flex-col justify-start items-start gap-2 inline-flex">
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <div data-svg-wrapper>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 md:w-6 md:h-6 sm:w-5 sm:h-5"
                >
                  <path
                    d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z"
                    stroke="#827FAE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <span className="text-slate-400 text-base md:text-base sm:text-sm font-['Nunito'] info-text">
                  {t("HometaskStudent.components.HometaskCard.Issued")}
                </span>
                <span className="text-slate-900 text-base md:text-base sm:text-sm font-['Nunito']"> {issuedDate}</span>
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <div data-svg-wrapper>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 md:w-6 md:h-6 sm:w-5 sm:h-5"
                >
                  <path
                    d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.73279 13.1819 3 12 3C10.8181 3 9.64778 3.73279 8.55585 4.18508C7.46392 4.13738 6.47177 5.30031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                    stroke="#827FAE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <span className="text-slate-400 text-base md:text-base sm:text-sm font-['Nunito'] info-text">
                  {status === "done"
                    ? t("HometaskStudent.components.HometaskCard.Done")
                    : t("HometaskStudent.components.HometaskCard.Due")}
                  :{" "}
                </span>
                <span className={`text-base md:text-base sm:text-sm font-['Nunito'] homework-status-${statusColors[status]}`}>
                  {dueDate}
                </span>
              </div>
            </div>
          </div>
          <StatusButton status={status} mark={mark} maxmark={maxmark} onClick={onClick} className={`w-full md:w-36 h-12 p-2 gap-2`} />
        </div>
      </div>
    </div>
  );
};