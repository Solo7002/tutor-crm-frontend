import React, { useEffect, useState } from 'react';
import './ProfileStudent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from "jwt-decode";
import Reviews from './Reviews/Reviews';
import GroupList from './components/GroupList';
import { PatternFormat } from 'react-number-format';
import { toast } from 'react-toastify';

export default function ProfileStudent() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState({UserPhones: []});
    const [student, setStudent] = useState({});
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                
                axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/students/${decoded.id}/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    setStudent(res.data.student);
                    setUser(res.data.user);
                    setGroups(res.data.groups);
                });
                
            } catch (error) {
                toast.error(t('ProfileStudent.Messages.TokenDecodeError'));
            }
        }
    }, []);

    return (
        <div className='main-block w-full h-full px-4 md:px-6 lg:pr-8 mt-4 md:mt-[35px]'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[20px]'>
                <div className='info-block w-full flex flex-col gap-4 md:gap-[20px]'>
                    <div className="relative w-full">
                        <div className="w-full bg-white rounded-[20px] p-4 md:p-5">
                            <div className="w-full space-y-3 md:space-y-4">
                                <div className="w-full">
                                    <div className="w-full flex flex-col items-center">
                                        <img
                                            className="w-20 h-20 md:w-[92px] md:h-[92px] rounded-full"
                                            src={user.ImageFilePath ? user.ImageFilePath : `https://ui-avatars.com/api/?name=${user.LastName + ' ' + user.FirstName}&background=random&size=86`}
                                            alt='teacher'
                                        />
                                        <div className="text-black text-sm md:text-[15px] font-normal font-['Mulish'] mt-2">
                                            {user && user.FirstName ? user.FirstName : "Орина"} {user && user.LastName ? user.LastName : "Щупальцева"}
                                        </div>
                                    </div>
                                    <div className="text-center text-[#827ead] text-xs font-normal font-['Mulish'] mt-1">
                                        {user && user.Email ? user.Email : "example@gmail.com"}
                                    </div>
                                    <div className="text-center text-[#827ead] text-xs font-normal font-['Mulish'] mt-1">
                                        {user && user.PhoneNumber ? <PatternFormat format="+ ## (###) ###-##-##" mask="_" name="PhoneNumber" value={user.PhoneNumber}
                                        placeholder="+ __ (___) ___-__-__" /> : ""}
                                    </div>
                                </div>

                                <div className="w-full flex justify-center mt-3">
                                    <button
                                        className="px-4 py-2 rounded-[40px] outline outline-1 outline-[#8a48e6] flex justify-center hover:bg-[#632DAE] hover:text-white items-center text-[#8a48e6] text-xs md:text-[15px] font-bold font-['Nunito'] transition-colors"
                                        onClick={() => navigate("/user/edit")}
                                    >
                                        {t('ProfileStudent.Buttons.EditProfile')}
                                    </button>
                                </div>
                                <div className="w-full flex flex-col items-center mt-2">
                                    <div className="text-[#827ead] text-[10px] font-normal font-['Mulish'] mt-1">
                                        {t('ProfileStudent.Content.RegisteredUser')}: {new Date(user.CreateDate).toLocaleDateString('ua-UA')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full overflow-hidden">
                        <div className="w-full h-auto md:h-72 bg-[#120C38] rounded-[20px] p-4 md:p-5 relative">
                            <div className="podpiska-bg w-full h-full absolute inset-0 rounded-[20px] opacity-10" />

                            <div className="space-y-2 md:space-y-4 relative z-10">
                                <div className="text-white text-xl md:text-[32px] font-bold font-['Nunito']">
                                    {t('ProfileStudent.Content.LearnFull')}
                                </div>
                                <div className="text-[#827ead] text-sm md:text-[15px] font-normal font-['Mulish']">
                                    {t('ProfileStudent.Content.SubscriptionPrompt')}
                                </div>

                                <div className="absolute top-[76px] left-1/2 hidden md:block" data-svg-wrapper>
                                    <svg width="177" height="212" viewBox="0 0 177 212" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_75_627)">
                                            <path d="M0.182785 246.15C0.284969 246.984 0.450781 247.805 0.678245 248.604C2.04175 253.804 5.40295 257.848 9.1407 260.131C10.3263 260.862 11.554 261.497 12.815 262.03C23.1206 266.629 35.7211 265.931 45.5471 259.627C47.8205 258.161 49.8643 256.256 51.5917 253.993C55.0401 242.827 53.9263 230.422 53.411 218.789C52.8918 206.948 52.0079 195.108 51.5322 183.244C51.0368 171.065 47.9927 121.174 47.4774 109C45.1533 109.674 42.7957 110.181 40.4181 110.516C40.5846 117.037 43.2759 161.295 43.3988 167.825C43.6049 177.864 44.1241 187.851 44.35 197.867C44.5958 207.757 45.2577 218.249 42.614 227.779C40.0772 236.828 34.5479 242.48 28.1465 243.567C25.9145 243.961 23.6363 243.803 21.4598 243.104C19.0459 242.333 15.9107 240.863 14.7731 237.558C14.722 237.451 14.6808 237.338 14.6502 237.221C13.909 234.526 14.8365 231.421 16.097 229.013C18.4276 224.539 21.3568 222.662 24.7616 220.231C27.1992 218.475 28.7252 212.989 24.496 213.229C20.9643 213.419 17.0046 213.539 13.6395 215.415C7.79701 218.651 3.17536 227.256 1.13407 235.104C0.218458 238.64 -0.29682 242.49 0.182785 246.15Z" fill="#5224AA" />
                                            <path d="M137.808 249.667C137.706 250.522 137.54 251.364 137.313 252.184C135.953 257.517 132.589 261.664 128.851 264.006C127.667 264.756 126.441 265.407 125.182 265.954C114.878 270.671 102.275 269.955 92.4509 263.489C90.1793 261.983 88.1362 260.029 86.4073 257.711C82.9594 246.258 84.073 233.536 84.5922 221.604C85.1074 209.46 85.9951 197.315 86.4707 185.147C86.9621 172.657 90.0057 121.486 90.5249 109C92.8472 109.692 95.2031 110.211 97.5791 110.555C97.4166 117.243 94.7217 162.636 94.5989 169.334C94.3928 179.63 93.8776 189.873 93.6478 200.145C93.402 210.29 92.7402 221.05 95.3836 230.824C97.9199 240.106 103.452 245.903 109.849 247.017C112.08 247.421 114.358 247.26 116.534 246.543C118.948 245.751 122.106 244.244 123.22 240.855C123.274 240.747 123.316 240.63 123.343 240.509C124.088 237.745 123.157 234.56 121.9 232.09C119.566 227.501 116.637 225.577 113.233 223.083C110.796 221.282 109.27 215.655 113.499 215.902C117.03 216.096 120.993 216.22 124.353 218.144C130.195 221.462 134.816 230.289 136.861 238.338C137.788 241.964 138.303 245.912 137.808 249.667Z" fill="#5224AA" />
                                            <path d="M128.004 1.84827C102.648 -4.0136 66.301 4.17889 53.8893 24.923C23.2843 27.8892 0 49.9674 0 71.5943C0 95.2968 27.9767 116.37 62.8557 116.37C63.2504 116.37 63.645 116.335 64.0397 116.331C86.0532 116.331 93.0898 123.511 113.031 125.434C137.764 127.82 160.07 126.894 173.188 90.0666C186.764 51.9174 162.382 9.80926 128.004 1.84827Z" fill="#8A48E6" />
                                            <path d="M65.3257 261.526C63.9593 264.998 61.9687 268.163 59.4619 270.85C59.1612 271.222 58.8362 271.571 58.4892 271.896C57.3313 273.044 56.0826 274.087 54.7566 275.015C54.1596 275.429 53.5309 275.843 52.9062 276.231C51.7652 276.886 50.5918 277.477 49.391 278.002C48.9956 278.167 48.6714 278.329 48.2918 278.461C47.352 278.853 46.3892 279.182 45.4094 279.445C40.892 280.768 36.1881 281.252 31.511 280.877C31.3529 280.877 31.2303 280.844 31.0721 280.844C28.2035 280.624 25.3588 280.141 22.571 279.4C14.663 277.365 7.38761 273.133 3.21613 265.422C-7.79578 245.153 11.0886 207.923 35.3069 215.406C35.5618 215.478 35.8126 215.565 36.0581 215.667C36.0898 215.667 36.1214 215.7 36.153 215.7C36.7759 215.936 37.3237 216.348 37.7346 216.892C37.7742 216.949 37.8414 216.987 37.877 217.045C37.9126 217.103 37.877 217.045 37.877 217.069C37.9442 217.181 38.0549 217.247 38.1063 217.376C38.8971 219.146 37.4143 221.049 35.9435 222.265C31.4873 225.938 25.9042 228.271 22.2349 232.83C17.7787 238.311 16.9959 246.894 20.7284 252.917C27.2842 263.482 41.2102 260.992 46.295 250.555C51.2178 240.412 49.652 227.804 50.0593 216.85C50.3716 208.316 50.0593 199.749 49.7746 191.253C49.2408 174.086 48.193 156.956 46.9198 139.826C46.1685 129.584 45.3118 119.345 44.3497 109.108L68.912 101V224.999C68.9041 236.979 69.9084 250.104 65.3257 261.526Z" fill="#8A48E6" />
                                            <path d="M69.0954 101V225.028C69.0954 237 68.083 250.147 72.6544 261.564C78.3647 275.84 92.2846 281.942 106.481 280.883C117.487 280.056 129.022 276.002 134.772 265.44C145.809 245.17 126.926 207.939 102.673 215.41C101.566 215.75 100.379 216.279 99.9049 217.375C99.114 219.142 100.601 221.074 102.064 222.277C106.544 225.963 112.108 228.288 115.798 232.834C120.251 238.32 121.034 246.899 117.289 252.923C110.74 263.48 96.8125 261.01 91.723 250.573C86.7839 240.438 88.3775 227.821 87.9702 216.842C87.6538 208.332 87.9702 199.765 88.2352 191.26C88.7809 174.101 89.817 156.958 91.0824 139.844C91.8456 129.589 92.6642 119.334 93.6765 109.104L69.0954 101Z" fill="#8A48E6" />
                                            <path d="M92.3479 121.055C98.3347 122.828 104.499 124.614 113.024 125.434C137.756 127.819 160.062 126.893 173.18 90.0664C178.875 74.0777 177.884 57.3985 172.3 42.8223C177.067 57.63 157.591 78.9391 143.569 80.74C141.282 81.0084 139.13 81.9608 137.399 83.4713C135.667 84.9818 134.438 86.9791 133.873 89.1993C126.88 117.751 92.3479 121.055 92.3479 121.055Z" fill="#5224AA" />
                                            <path d="M76.7001 41.3862C76.7001 41.2685 75.9542 34.9633 74.0046 31.487C80.6308 30.8592 105.707 39.4166 110.861 45.0548C96.543 41.2293 76.9211 41.3862 76.708 41.3862H76.7001Z" fill="#120C38" />
                                            <path d="M44.2006 38.2748C44.2006 38.2748 43.4981 31.8832 44.6386 28.0263C38.0362 28.866 15.4701 42.7045 11.6934 49.3354C24.8983 42.4259 44.2006 38.2748 44.2006 38.2748Z" fill="#120C38" />
                                            <path d="M86.6097 80.2652C92.2767 80.2652 96.8706 75.6979 96.8706 70.0639C96.8706 64.4298 92.2767 59.8625 86.6097 59.8625C80.9428 59.8625 76.3489 64.4298 76.3489 70.0639C76.3489 75.6979 80.9428 80.2652 86.6097 80.2652Z" fill="white" />
                                            <path d="M88.0857 77.1224C91.2984 77.1224 93.9028 73.7338 93.9028 69.5537C93.9028 65.3737 91.2984 61.9851 88.0857 61.9851C84.873 61.9851 82.2686 65.3737 82.2686 69.5537C82.2686 73.7338 84.873 77.1224 88.0857 77.1224Z" fill="#120C38" />
                                            <path d="M69.0635 118.885C69.0635 118.885 68.4124 158.361 68.4124 180.349C68.4124 202.336 68.7794 234.188 68.7794 234.188C68.7794 234.188 69.3477 195.317 69.3477 180.082C69.3477 164.846 69.0951 118.301 69.0951 118.301" fill="#120C38" />
                                            <path d="M86.6097 46.7419C80.8354 46.7446 75.2746 48.9128 71.038 52.8136C66.8013 56.7143 64.2007 62.0605 63.7556 67.7842H57.5004C57.0413 61.9048 54.3099 56.4306 49.8792 52.5099C45.4485 48.5892 39.6628 46.5267 33.7357 46.7551C27.8086 46.9835 22.2008 49.485 18.0887 53.7349C13.9765 57.9847 11.6794 63.6527 11.6794 69.5498C11.6794 75.4469 13.9765 81.1149 18.0887 85.3648C22.2008 89.6147 27.8086 92.1162 33.7357 92.3446C39.6628 92.573 45.4485 90.5105 49.8792 86.5898C54.3099 82.6691 57.0413 77.1949 57.5004 71.3155H63.7556C64.1032 75.736 65.7399 79.9599 68.4651 83.4699C71.1903 86.9799 74.8858 89.6237 79.0992 91.0776C83.3126 92.5315 87.8609 92.7324 92.1874 91.6558C96.5139 90.5791 100.431 88.2715 103.458 85.0157C106.486 81.7598 108.493 77.6969 109.233 73.3243C109.974 68.9518 109.416 64.4595 107.628 60.3974C105.84 56.3352 102.9 52.8796 99.1664 50.4535C95.4333 48.0274 91.0696 46.7362 86.6097 46.738V46.7419ZM34.6502 88.9834C30.7839 88.9842 27.0041 87.845 23.789 85.7099C20.5739 83.5748 18.0679 80.5398 16.588 76.9886C15.108 73.4374 14.7206 69.5296 15.4747 65.7595C16.2288 61.9894 18.0906 58.5263 20.8245 55.8082C23.5584 53.0901 27.0417 51.2392 30.8338 50.4894C34.6259 49.7397 38.5565 50.1249 42.1284 51.5963C45.7003 53.0676 48.7531 55.5591 50.9006 58.7555C53.0482 61.952 54.194 65.7098 54.1932 69.5538C54.1932 72.1053 53.6877 74.6319 52.7056 76.9892C51.7235 79.3465 50.2839 81.4884 48.4692 83.2926C46.6545 85.0968 44.5001 86.528 42.129 87.5045C39.7579 88.4809 37.2166 88.9834 34.6502 88.9834ZM86.6097 88.9834C82.7437 88.9827 78.9647 87.8422 75.7506 85.7061C72.5366 83.5701 70.0318 80.5345 68.5531 76.9831C67.0743 73.4318 66.688 69.5243 67.443 65.7547C68.198 61.9851 70.0604 58.5227 72.7946 55.8054C75.5289 53.0881 79.0122 51.238 82.8041 50.4889C86.596 49.7398 90.5261 50.1254 94.0976 51.597C97.669 53.0686 100.721 55.5601 102.869 58.7564C105.016 61.9526 106.161 65.7102 106.161 69.5538C106.161 72.106 105.655 74.6332 104.672 76.991C103.69 79.3488 102.249 81.4911 100.434 83.2954C98.6182 85.0997 96.4629 86.5307 94.0909 87.5067C91.7189 88.4827 89.1768 88.9845 86.6097 88.9834Z" fill="#120C38" />
                                            <path d="M22.3372 71.9942C22.3843 72.3744 22.5695 72.7243 22.8581 72.978C23.1467 73.2318 23.5187 73.3718 23.9039 73.3718C24.2892 73.3718 24.6611 73.2318 24.9497 72.978C25.2383 72.7243 25.4236 72.3744 25.4707 71.9942C25.4707 71.9432 25.447 71.904 25.443 71.8569H25.4865C25.4865 69.5051 26.4261 67.2497 28.0988 65.5867C29.7714 63.9238 32.04 62.9896 34.4055 62.9896C36.771 62.9896 39.0396 63.9238 40.7123 65.5867C42.3849 67.2497 43.3246 69.5051 43.3246 71.8569H43.368C43.368 71.904 43.3404 71.9432 43.3404 71.9942C43.3875 72.3744 43.5728 72.7243 43.8613 72.978C44.1499 73.2318 44.5219 73.3718 44.9071 73.3718C45.2924 73.3718 45.6643 73.2318 45.9529 72.978C46.2415 72.7243 46.4268 72.3744 46.4739 71.9942C46.4739 71.9432 46.4502 71.904 46.4463 71.8569H46.4739C46.4739 68.6747 45.2024 65.6229 42.9391 63.3728C40.6759 61.1226 37.6062 59.8585 34.4055 59.8585C31.2048 59.8585 28.1352 61.1226 25.8719 63.3728C23.6086 65.6229 22.3372 68.6747 22.3372 71.8569H22.3648C22.3608 71.904 22.3372 71.9432 22.3372 71.9942Z" fill="#120C38" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_75_627">
                                                <rect width="177" height="272" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className='absolute -bottom-[110px] -left-5'>
                                    <svg width="75" height="76" viewBox="0 0 75 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M57.136 10.7083C43.8304 -3.48311 12.168 -0.545647 -2 2.697L-0.768 28.4475C17.712 22.1529 52.824 18.0023 52.824 38.1754C52.824 61.0647 58.552 68.3845 62 72.5192C64.9935 76.1088 75 77.0872 75 73.6538C75 70.2205 67.608 69.6482 64.528 61.0647C61.448 52.4813 73.768 28.4475 57.136 10.7083Z" fill="#8A48E6" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M74.2473 75.0489C74.3608 74.7052 74.4265 74.384 74.4265 74.1122C74.4265 73.4402 73.3229 73.3703 71.7898 73.2731C69.9004 73.1534 67.3587 72.9923 65.4265 71.6122C61.9265 69.1122 57.9998 56.1314 57.9998 49.6122C57.9998 42.0192 57.63 34.0191 53.4265 25.6123C49.634 18.0273 32.9621 14.1208 10 25.5758C28.7577 21.5381 52.7505 21.5929 52.7505 38.2686C52.7505 61.1579 58.4785 68.4777 61.9265 72.6124C64.4481 75.6362 71.9461 76.8071 74.2473 75.0489Z" fill="#AB85E5" />
                                    </svg>
                                </div>
                                <div className="w-full flex justify-center mt-24 md:absolute md:-bottom-[150px] md:-left-0 md:w-auto md:mt-0">
                                    <a href='https://tutoct.great-site.net/price/' className="w-auto px-4 py-2 bg-[#8a48e6] hover:bg-[#632DAE] rounded-[40px] flex justify-center items-center text-white text-sm md:text-[15px] font-bold font-['Nunito']">
                                        {t('ProfileStudent.Buttons.LearnMore')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='big-block w-full flex flex-col items-start md:col-span-2 lg:col-span-3 gap-4 md:gap-[20px]'>
                    <div className='blocks w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[20px]'>
                        <div className='uchni w-full h-[140px] md:h-[180px] flex items-center'>
                            <div className="w-full h-full bg-white rounded-[20px] flex justify-center items-center flex-col">
                                <div className="text-center text-[#8a48e6] text-2xl md:text-[32px] font-bold font-['Nunito']">{student && student.CourseCount ? student.CourseCount : "0"}</div>
                                <div className="text-center text-[#120c38] text-lg md:text-2xl font-bold font-['Nunito']">{t('ProfileStudent.Stats.Courses')}</div>
                            </div>
                        </div>

                        <div className='rating w-full h-[140px] md:h-[180px] flex items-center'>
                            <div className="w-full h-full bg-white rounded-[20px] flex justify-center items-center flex-col">
                                <div className="text-center text-[#120c38] text-lg md:text-2xl font-bold font-['Nunito'] mb-2">{t('ProfileStudent.Stats.Rating')}</div>
                                <div className="text-center text-[#8a48e6] text-lg md:text-2xl font-bold font-['Nunito']">{student && student.Rating ? student.Rating : "0"}</div>
                                <div className="text-center text-[#120c38] text-lg md:text-2xl font-bold font-['Nunito'] mb-2">{t('ProfileStudent.Stats.ByTrophies')}</div>
                            </div>
                        </div>

                        <div className='w-full h-[140px] md:h-[180px] flex items-center'>
                            <div className="w-full h-full bg-white rounded-[20px] flex justify-center items-center flex-col p-2">
                                <div className="text-center text-[#8a48e6] text-2xl md:text-[32px] font-bold font-['Nunito']">{student && student.Balance ? student.Balance : "0"}</div>
                                <div className="text-center text-[#120c38] text-sm md:text-lg lg:text-2xl font-bold font-['Nunito']">{t('ProfileStudent.Stats.Trophies')}</div>
                            </div>
                        </div>
                    </div>

                    <GroupList groups={groups}/>
                    <Reviews userId={user.UserId}/>
                </div>
            </div>
        </div>
    );
}