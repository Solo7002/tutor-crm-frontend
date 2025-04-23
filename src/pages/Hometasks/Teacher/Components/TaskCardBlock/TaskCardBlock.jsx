import React from "react";
import axios from 'axios';
import { formatDate } from "../../../../../functions/formatDate";
import { toast } from "react-toastify";

const TaskCardBlock = ({ hometask, onEdit, setRefreshTrigger }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/hometasks/${hometask.HometaskId}`);
            setRefreshTrigger();
                  toast.success("Завдання було успішно видалено", {
                      position: "bottom-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                  });
        } catch (error) {
            console.error("Помилка при видаленні домашнього завдання:", error);
            alert("Не вдалося видалити домашнє завдання");
            toast.error("Не вдалося видалити домашнє завдання", {
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
        <div className="task-block-card relative flex flex-col sm:flex-row w-full max-w-[420px] h-auto sm:h-[230px] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#e0e0e0]"
            style={{ backgroundImage: 'linear-gradient(to top right, white, transparent)' }}>
            <div className="flex flex-col justify-between w-full sm:w-[55%] mb-4 sm:mb-0">
                <div>
                    <p className="text-sm text-[#827FAE]" style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "15px" }}>
                        {hometask.SubjectName}
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold leading-tight mt-1" style={{ fontFamily: "Mulish", fontWeight: 400, fontSize: "19px" }}>
                        {hometask.HometaskHeader}
                    </h3>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mt-3 sm:mt-0">
                    <p className="flex items-center gap-2">
                        <div>
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3.5V7.5M8 3.5V7.5M4 11.5H20M7 14.5H7.013M10.01 14.5H10.015M13.01 14.5H13.015M16.015 14.5H16.02M13.015 17.5H13.02M7.01 17.5H7.015M10.01 17.5H10.015M4 7.5C4 6.96957 4.21071 6.46086 4.58579 6.08579C4.96086 5.71071 5.46957 5.5 6 5.5H18C18.5304 5.5 19.0391 5.71071 19.4142 6.08579C19.7893 6.46086 20 6.96957 20 7.5V19.5C20 20.0304 19.7893 20.5391 19.4142 20.9142C19.0391 21.2893 18.5304 21.5 18 21.5H6C5.46957 21.5 4.96086 21.2893 4.58579 20.9142C4.21071 20.5391 4 20.0304 4 19.5V7.5Z" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-col">
                            <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "15px", color: "#827fae" }}>Видано:</div>
                            <div style={{ fontFamily: "Mulish", fontWeight: 800, fontSize: "15px", color: "#8a48e6" }}>
                                {formatDate(hometask.HometaskStartDate)}
                            </div>
                        </div>
                    </p>
                    <p className="flex items-center gap-2">
                        <div>
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 14.5L12 12.5V7.5M3 12.5C3 13.6819 3.23279 14.8522 3.68508 15.9442C4.13738 17.0361 4.80031 18.0282 5.63604 18.864C6.47177 19.6997 7.46392 20.3626 8.55585 20.8149C9.64778 21.2672 10.8181 21.5 12 21.5C13.1819 21.5 14.3522 21.2672 15.4442 20.8149C16.5361 20.3626 17.5282 19.6997 18.364 18.864C19.1997 18.0282 19.8626 17.0361 20.3149 15.9442C20.7672 14.8522 21 13.6819 21 12.5C21 11.3181 20.7672 10.1478 20.3149 9.05585C19.8626 7.96392 19.1997 6.97177 18.364 6.13604C17.5282 5.30031 16.5361 4.63738 15.4442 4.18508C14.3522 3.73279 13.1819 3.5 12 3.5C10.8181 3.5 9.64778 3.73279 8.55585 4.18508C7.46392 4.63738 6.47177 5.30031 5.63604 6.13604C4.80031 6.97177 4.13738 7.96392 3.68508 9.05585C3.23279 10.1478 3 11.3181 3 12.5Z" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-col">
                            <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "15px", color: "#827fae" }}>Виконати до:</div>
                            <div style={{ fontFamily: "Mulish", fontWeight: 800, fontSize: "15px" }}>
                                {formatDate(hometask.HometaskDeadlineDate)}
                            </div>
                        </div>
                    </p>
                </div>
            </div>
            <div className="flex flex-col sm:h-full sm:w-[45%] items-center justify-between gap-3 sm:gap-5">
                <img
                    className="h-40 sm:h-[65%] w-full object-cover rounded-md"
                    src={hometask.HometaskCover || "https://via.placeholder.com/150"}
                    alt="Book Cover"
                />
                <div className="flex w-full sm:h-[30%] items-center justify-center sm:justify-start gap-2 sm:gap-4">
                    <div className="inline-flex w-full sm:w-auto">
                        <button
                            className="
                                relative flex items-center justify-center
                                pr-1 sm:pr-2 pl-2 sm:pl-3 py-1 sm:py-2
                                bg-white
                                text-[#E64851]
                                rounded-l-full
                                outline outline-1 outline-[#E64851]
                                transform
                                hover:bg-[#FFEDEE]
                                text-xs sm:text-sm
                            "
                            onClick={handleDelete}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 sm:w-8 sm:h-8"
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
                                relative flex items-center
                                px-2 sm:px-4 py-1 sm:py-2
                                bg-white
                                text-[#8A48E6]
                                rounded-r-full
                                outline outline-1 outline-[#8A48E6]
                                border-l-0
                                transform
                                hover:bg-[#EFE2FB]
                                flex-grow sm:flex-grow-0
                                text-xs sm:text-sm
                            "
                            onClick={() => onEdit(hometask)}
                        >
                            <span className="mr-1 sm:mr-2" style={{
                                fontFamily: "Nunito",
                                fontWeight: 700,
                                fontSize: "15px",
                                textAlign: "center",
                                verticalAlign: "middle"
                            }}>Змінити</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 sm:w-6 sm:h-6"
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
            </div>
        </div>
    );
};

export default TaskCardBlock;