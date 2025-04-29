import React from "react";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { formatDate } from "../../../../../functions/formatDate";
import { toast } from "react-toastify";

const TaskCardTile = ({ hometask, onEdit, setRefreshTrigger }) => {
  const { t } = useTranslation();
  const token = sessionStorage.getItem('token');

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/hometasks/${hometask.HometaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefreshTrigger();
      toast.success(t('HomeTaskTeacher.components.TaskCardTile.DeleteSuccess'), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(t('HomeTaskTeacher.components.TaskCardTile.DeleteError'), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      className="task-block-card relative flex flex-col sm:flex-row items-center w-full max-w-[640px] min-h-[160px] px-4 sm:px-6 py-4 rounded-3xl border border-[#e0e0e0]"
      style={{ backgroundImage: "linear-gradient(to top right, white, transparent)" }}
    >
      {/* Левая часть: Текстовая информация */}
      <div className="w-full sm:w-3/5 flex flex-col mb-4 sm:mb-0">
        <p
          className="text-sm text-[#827FAE]"
          style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "15px" }}
        >
          {hometask.SubjectName}
        </p>
        <h3
          className="leading-tight mt-1"
          style={{
            fontFamily: "Mulish",
            fontWeight: 400,
            fontSize: "19px",
          }}
        >
          {hometask.HometaskHeader}
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-700 mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M16 3.5V7.5M8 3.5V7.5M4 11.5H20M7 14.5H7.013M10.01 14.5H10.015M13.01 14.5H13.015M16.015 14.5H16.02M13.015 17.5H13.02M7.01 17.5H7.015M10.01 17.5H10.015M4 7.5C4 6.96957 4.21071 6.46086 4.58579 6.08579C4.96086 5.71071 5.46957 5.5 6 5.5H18C18.5304 5.5 19.0391 5.71071 19.4142 6.08579C19.7893 6.46086 20 6.96957 20 7.5V19.5C20 20.0304 19.7893 20.5391 19.4142 20.9142C19.0391 21.2893 18.5304 21.5 18 21.5H6C5.46957 21.5 4.96086 21.2893 4.58579 20.9142C4.21071 20.5391 4 20.0304 4 19.5V7.5Z"
                stroke="#827FAE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex-col">
              <div
                style={{
                  fontFamily: "Nunito",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#827fae",
                }}
              >
                {t('HomeTaskTeacher.components.TaskCardTile.Issued')}
              </div>
              <div
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 800,
                  fontSize: "14px",
                  color: "#8a48e6",
                }}
              >
                {formatDate(hometask.HometaskStartDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M15 14.5L12 12.5V7.5M3 12.5C3 13.6819 3.23279 14.8522 3.68508 15.9442C4.13738 17.0361 4.80031 18.0282 5.63604 18.864C6.47177 19.6997 7.46392 20.3626 8.55585 20.8149C9.64778 21.2672 10.8181 21.5 12 21.5C13.1819 21.5 14.3522 21.2672 15.4442 20.8149C16.5361 20.3626 17.5282 19.6997 18.364 18.864C19.1997 18.0282 19.8626 17.0361 20.3149 15.9442C20.7672 14.8522 21 13.6819 21 12.5C21 11.3181 20.7672 10.1478 20.3149 9.05585C19.8626 7.96392 19.1997 6.97177 18.364 6.13604C17.5282 5.30031 16.5361 4.63738 15.4442 4.18508C14.3522 3.73279 13.1819 3.5 12 3.5C10.8181 3.5 9.64778 3.73279 8.55585 4.18508C7.46392 4.63738 6.47177 5.30031 5.63604 6.13604C4.80031 6.97177 4.13738 7.96392 3.68508 9.05585C3.23279 10.1478 3 11.3181 3 12.5Z"
                stroke="#827FAE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex-col">
              <div
                style={{
                  fontFamily: "Nunito",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#827fae",
                }}
              >
                {t('HomeTaskTeacher.components.TaskCardTile.Due')}
              </div>
              <div
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                {formatDate(hometask.HometaskDeadlineDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Правая часть: Кнопки */}
      <div className="w-full sm:w-2/5 flex flex-col sm:ml-2 gap-2">
        <button
          className="
            h-[40px] sm:h-[45px] w-full
            relative flex items-center justify-between
            px-3 sm:px-4 py-2
            bg-white
            text-[#E64851]
            rounded-full
            outline outline-1 outline-[#E64851]
            transform
            hover:bg-[#FFEDEE]
          "
          onClick={handleDelete}
        >
          <span
            className="mr-1 sm:mr-2 text-sm sm:text-base"
            style={{
              fontFamily: "Nunito",
              fontWeight: 700,
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            {t('HomeTaskTeacher.components.TaskCardTile.Delete')}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M5.33301 9.33333H26.6663M6.66634 9.33333L7.99967 25.3333C7.99967 26.0406 8.28063 26.7189 8.78072 27.219C9.28082 27.719 9.9591 28 10.6663 28H21.333C22.0403 28 22.7185 27.719 23.2186 27.219C23.7187 26.7189 23.9997 26.0406 23.9997 25.3333L25.333 9.33333M11.9997 9.33333V5.33333C11.9997 4.97971 12.1402 4.64057 12.3902 4.39052C12.6402 4.14048 12.9794 4 13.333 4H18.6663C19.02 4 19.3591 4.14048 19.6091 4.39052C19.8592 4.64057 19.9997 4.97971 19.9997 5.33333V9.33333M13.333 16L18.6663 21.3333M18.6663 16L13.333 21.3333"
              stroke="#E64851"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="
            h-[40px] sm:h-[45px] w-full
            relative flex justify-between items-center
            px-3 sm:px-4 py-2
            bg-white
            text-[#8A48E6]
            rounded-full
            outline outline-1 outline-[#8A48E6]
            transform
            hover:bg-[#EFE2FB]
          "
          onClick={() => onEdit(hometask)}
        >
          <span
            className="mr-1 sm:mr-2 text-sm sm:text-base"
            style={{
              fontFamily: "Nunito",
              fontWeight: 700,
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            {t('HomeTaskTeacher.components.TaskCardTile.Edit')}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M5.33301 6.3335H3.99967C3.29243 6.3335 2.61415 6.61445 2.11406 7.11454C1.61396 7.61464 1.33301 8.29292 1.33301 9.00016V21.0002C1.33301 21.7074 1.61396 22.3857 2.11406 22.8858C2.61415 23.3859 3.29243 23.6668 3.99967 23.6668H15.9997C16.7069 23.6668 17.3852 23.3859 17.8853 22.8858C18.3854 22.3857 18.6663 21.7074 18.6663 21.0002V19.6668"
              stroke="#8A48E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.3333 3.66681L21.3333 7.66681M23.18 5.78014C23.7051 5.25501 24.0001 4.54279 24.0001 3.80014C24.0001 3.0575 23.7051 2.34527 23.18 1.82014C22.6549 1.29501 21.9426 1 21.2 1C20.4574 1 19.7451 1.29501 19.22 1.82014L8 13.0001V17.0001H12L23.18 5.78014Z"
              stroke="#8A48E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCardTile;