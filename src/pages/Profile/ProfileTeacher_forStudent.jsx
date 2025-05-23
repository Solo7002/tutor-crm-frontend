import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfileTeacher.css';
import Reviews from './Reviews/Reviews';
import axios from 'axios';
import CourseList from './components/CourseList';
import { jwtDecode } from "jwt-decode";
import { decryptData } from '../../utils/crypto';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const FilledStar = () => (
    <svg width="34" height="33" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.0489 0.946216C16.3483 0.0249052 17.6517 0.0249052 17.9511 0.946216L21.2658 11.1478C21.3996 11.5599 21.7836 11.8388 22.2168 11.8388H32.9434C33.9122 11.8388 34.3149 13.0784 33.5312 13.6478L24.8532 19.9528C24.5027 20.2074 24.3561 20.6588 24.4899 21.0708L27.8046 31.2725C28.104 32.1938 27.0495 32.9599 26.2658 32.3905L17.5878 26.0855C17.2373 25.8309 16.7627 25.8309 16.4122 26.0855L7.73419 32.3905C6.95048 32.9599 5.896 32.1938 6.19535 31.2725L9.51006 21.0708C9.64393 20.6588 9.49728 20.2074 9.14679 19.9528L0.468768 13.6478C-0.314945 13.0784 0.0878303 11.8388 1.05655 11.8388H11.7832C12.2164 11.8388 12.6004 11.5599 12.7342 11.1478L16.0489 0.946216Z"
            fill="#FFA869"
        />
    </svg>
);

const EmptyStar = () => (
    <svg width="34" height="33" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.0489 0.946216C16.3483 0.0249052 17.6517 0.0249052 17.9511 0.946216L21.2658 11.1478C21.3996 11.5599 21.7836 11.8388 22.2168 11.8388H32.9434C33.9122 11.8388 34.3149 13.0784 33.5312 13.6478L24.8532 19.9528C24.5027 20.2074 24.3561 20.6588 24.4899 21.0708L27.8046 31.2725C28.104 32.1938 27.0495 32.9599 26.2658 32.3905L17.5878 26.0855C17.2373 25.8309 16.7627 25.8309 16.4122 26.0855L7.73419 32.3905C6.95048 32.9599 5.896 32.1938 6.19535 31.2725L9.51006 21.0708C9.64393 20.6588 9.49728 20.2074 9.14679 19.9528L0.468768 13.6478C-0.314945 13.0784 0.0878303 11.8388 1.05655 11.8388H11.7832C12.2164 11.8388 12.6004 11.5599 12.7342 11.1478L16.0489 0.946216Z"
            stroke='#FFA869' strokeWidth="2px"
        />
    </svg>
);

const StarRating = ({ rating }) => {
    const roundedValue = Math.round(rating);
    const stars = Array.from({ length: 5 }, (_, index) =>
        index < roundedValue ? <FilledStar key={index} /> : <EmptyStar key={index} />
    );
    return (
        <div className="w-full flex justify-center gap-2.5">
            {stars}
        </div>
    );
};

export default function ProfileTeacher() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { encryptedTeacherId } = useParams();
    const [user, setUser] = useState({});
    const [teacher, setTeacher] = useState({});
    const [courses, setCourses] = useState([]);
    const [userFrom, setUserFrom] = useState();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decryptedTeacherId = decryptData(encryptedTeacherId);
                const decoded = jwtDecode(token);

                let teacherUserId;

                axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/teachers/${decryptedTeacherId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    teacherUserId = res.data.UserId;
                })
                    .then(() => {
                        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/teachers/${teacherUserId}/info`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then(res => {
                            setTeacher(res.data.teacher);
                            setUser(res.data.user);
                            setCourses(res.data.courses);
                        });
                    })
                    .then(() => {
                        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/users/${decoded.id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then(res => {
                            setUserFrom(res.data);
                        });
                    });
            } catch (error) {
                toast.error(t('ProfileTeacher_forStudent.Messages.TokenError'));
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
                                            src={user.ImageFilePath ? user.ImageFilePath : `https://ui-avatars.com/api/?name=${user.FirstName + ' ' + user.LastName}&background=random&size=86`}
                                            alt='teacher'
                                        />
                                        <div className="text-black text-sm md:text-[15px] font-normal font-['Mulish'] mt-2">
                                            {user && user.FirstName} {user && user.LastName}
                                        </div>
                                    </div>
                                    <div className="text-center text-[#827ead] text-xs font-normal font-['Mulish'] mt-1">
                                        {user && user.Email}
                                    </div>
                                </div>

                                <div className="w-full mt-3">
                                    <div className="w-full">
                                        <div className="w-full flex justify-between my-[2px]">
                                            <div className="text-black text-xs md:text-[15px] font-normal font-['Mulish']">{t('ProfileTeacher_forStudent.Info.Subject')}:</div>
                                            <div className="text-right text-black text-xs md:text-[15px] font-normal font-['Mulish']">{teacher.SubjectNames}</div>
                                        </div>
                                        <div className="w-full flex justify-between my-[2px]">
                                            <div className="text-black text-xs md:text-[15px] font-normal font-['Mulish']">{t('ProfileTeacher_forStudent.Info.PricePerLesson')}:</div>
                                            <div className="text-right text-black text-xs md:text-[15px] font-normal font-['Mulish']">{t('ProfileTeacher_forStudent.Info.PriceFrom')} {teacher.minPrice}грн</div>
                                        </div>
                                    </div>
                                    <div className="w-full my-1 text-[#827ead] text-xs font-normal font-['Mulish'] line-clamp-3 md:line-clamp-none">
                                        {teacher.AboutTeacher}
                                    </div>
                                </div>

                                <div className="w-full flex flex-col items-center mt-2">
                                    <div data-svg-wrapper className="">
                                        <svg width="130" height="30" viewBox="0 0 130 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M27.5 15C27.5 8.1 21.9 2.5 15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.05 6.8 26.0875 12.5 27.25V18.75H10V15H12.5V11.875C12.5 9.4625 14.4625 7.5 16.875 7.5H20V11.25H17.5C16.8125 11.25 16.25 11.8125 16.25 12.5V15H20V18.75H16.25V27.4375C22.5625 26.8125 27.5 21.4875 27.5 15Z" fill="#8A48E6" />
                                            <path d="M59.75 2.5H70.25C74.25 2.5 77.5 5.75 77.5 9.75V20.25C77.5 22.1728 76.7362 24.0169 75.3765 25.3765C74.0169 26.7362 72.1728 27.5 70.25 27.5H59.75C55.75 27.5 52.5 24.25 52.5 20.25V9.75C52.5 7.82718 53.2638 5.98311 54.6235 4.62348C55.9831 3.26384 57.8272 2.5 59.75 2.5ZM59.5 5C58.3065 5 57.1619 5.47411 56.318 6.31802C55.4741 7.16193 55 8.30653 55 9.5V20.5C55 22.9875 57.0125 25 59.5 25H70.5C71.6935 25 72.8381 24.5259 73.682 23.682C74.5259 22.8381 75 21.6935 75 20.5V9.5C75 7.0125 72.9875 5 70.5 5H59.5ZM71.5625 6.875C71.9769 6.875 72.3743 7.03962 72.6674 7.33265C72.9604 7.62567 73.125 8.0231 73.125 8.4375C73.125 8.8519 72.9604 9.24933 72.6674 9.54235C72.3743 9.83538 71.9769 10 71.5625 10C71.1481 10 70.7507 9.83538 70.4576 9.54235C70.1646 9.24933 70 8.8519 70 8.4375C70 8.0231 70.1646 7.62567 70.4576 7.33265C70.7507 7.03962 71.1481 6.875 71.5625 6.875ZM65 8.75C66.6576 8.75 68.2473 9.40848 69.4194 10.5806C70.5915 11.7527 71.25 13.3424 71.25 15C71.25 16.6576 70.5915 18.2473 69.4194 19.4194C68.2473 20.5915 66.6576 21.25 65 21.25C63.3424 21.25 61.7527 20.5915 60.5806 19.4194C59.4085 18.2473 58.75 16.6576 58.75 15C58.75 13.3424 59.4085 11.7527 60.5806 10.5806C61.7527 9.40848 63.3424 8.75 65 8.75ZM65 11.25C64.0054 11.25 63.0516 11.6451 62.3483 12.3483C61.6451 13.0516 61.25 14.0054 61.25 15C61.25 15.9946 61.6451 16.9484 62.3483 17.6517C63.0516 18.3549 64.0054 18.75 65 18.75C65.9946 18.75 66.9484 18.3549 67.6517 17.6517C68.3549 16.9484 68.75 15.9946 68.75 15C68.75 14.0054 68.3549 13.0516 67.6517 12.3483C66.9484 11.6451 65.9946 11.25 65 11.25Z" fill="#8A48E6" />
                                            <path d="M115 2.5C108.1 2.5 102.5 8.1 102.5 15C102.5 21.9 108.1 27.5 115 27.5C121.9 27.5 127.5 21.9 127.5 15C127.5 8.1 121.9 2.5 115 2.5ZM120.8 11C120.612 12.975 119.8 17.775 119.388 19.9875C119.212 20.925 118.862 21.2375 118.538 21.275C117.812 21.3375 117.262 20.8 116.562 20.3375C115.462 19.6125 114.838 19.1625 113.775 18.4625C112.538 17.65 113.337 17.2 114.05 16.475C114.238 16.2875 117.438 13.375 117.5 13.1125C117.509 13.0727 117.508 13.0315 117.497 12.9923C117.486 12.953 117.465 12.9171 117.438 12.8875C117.363 12.825 117.262 12.85 117.175 12.8625C117.062 12.8875 115.313 14.05 111.9 16.35C111.4 16.6875 110.95 16.8625 110.55 16.85C110.1 16.8375 109.25 16.6 108.612 16.3875C107.825 16.1375 107.213 16 107.262 15.5625C107.287 15.3375 107.6 15.1125 108.188 14.875C111.838 13.2875 114.262 12.2375 115.475 11.7375C118.95 10.2875 119.663 10.0375 120.138 10.0375C120.238 10.0375 120.475 10.0625 120.625 10.1875C120.75 10.2875 120.787 10.425 120.8 10.525C120.787 10.6 120.812 10.825 120.8 11Z" fill="#8A48E6" />
                                        </svg>
                                    </div>
                                    <div className="text-[#827ead] text-[10px] font-normal font-['Mulish'] mt-1">
                                        {t('ProfileTeacher_forStudent.Info.RegisteredUser')}: 12.10.2023
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
                                    {t('ProfileTeacher_forStudent.Subscription.Title')}
                                </div>
                                <div className="text-[#827ead] text-sm md:text-[15px] font-normal font-['Mulish']">
                                    {t('ProfileTeacher_forStudent.Subscription.Description')}
                                </div>

                                <div className="absolute top-[76px] left-4 hidden md:block" data-svg-wrapper>
                                    <svg width="261" height="155" viewBox="0 0 261 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M105.447 81.8029C105.447 81.8029 107.532 94.8287 101.007 99.9985C95.6693 104.216 89.1765 106.235 82.7717 108.204C75.6516 110.393 68.1244 111.7 60.6686 110.809C42.7089 108.67 29.6352 91.5189 33.6574 73.6407C34.9945 67.6776 39.0883 54.2799 47.2813 54.2744C50.9184 54.2744 48.5524 50.1167 46.1809 49.772C44.963 49.6674 43.7372 49.8434 42.5988 50.2863C31.7536 53.7821 25.8936 62.8032 22.1795 73.0061C19.0929 81.3411 18.463 90.3788 20.3637 99.0575C26.0807 124.447 58.1596 129.759 80.0315 126.958C86.864 126.095 93.5632 124.397 99.9777 121.903C105.254 119.846 111.346 117.527 114.201 112.297C119.093 103.347 116.953 79.0949 116.953 79.0949L105.447 81.8029Z" fill="#5224AA" />
                                        <path d="M135.045 130.481C133.574 130.051 132.045 129.846 130.511 129.874C128.958 129.843 127.41 130.063 125.928 130.525C126.788 127.38 127.424 124.179 127.832 120.945C128.019 119.43 128.42 116.569 130.489 116.569C132.558 116.569 132.932 119.419 133.119 120.945C133.551 124.162 134.194 127.348 135.045 130.481Z" fill="#AB85E5" />
                                        <path d="M159.084 84.6089C159.084 84.6089 156.994 97.6292 163.525 102.799C168.862 107.022 175.355 109.036 181.76 111.005C188.88 113.193 196.407 114.501 203.863 113.609C221.823 111.47 234.896 94.3194 230.874 76.4412C229.537 70.4781 225.443 57.0804 217.25 57.0749C213.608 57.0749 215.979 52.9172 218.351 52.578C219.568 52.4742 220.793 52.6482 221.933 53.0868C232.778 56.5826 238.638 65.6092 242.352 75.8066C245.453 84.1396 246.094 93.1801 244.201 101.863C238.484 127.253 206.41 132.565 184.538 129.797C177.7 128.925 170.995 127.22 164.576 124.72C159.299 122.663 153.208 120.343 150.352 115.114C145.461 106.169 147.601 81.9119 147.601 81.9119L159.084 84.6089Z" fill="#5224AA" />
                                        <path d="M153.731 78.9307C153.731 78.9307 151.051 90.3426 151.194 100.682C151.337 111.022 168.934 128.517 202.531 128.517C236.129 128.517 247.321 101.475 247.321 84.7515C247.321 78.1265 245.956 71.0748 241.818 65.6588C240.432 63.77 238.655 62.1977 236.607 61.047C234.23 59.7724 232.068 60.128 229.57 59.4988C227.639 59.0119 227.661 56.9878 229.119 55.9319C229.853 55.4489 230.704 55.1694 231.584 55.1223C236.657 54.6299 242.589 57.0534 246.908 59.5754C257.544 65.7956 260.823 78.8979 260.972 90.4356C261.165 105.464 256.108 121.197 245.213 131.887C233.873 143.003 217.844 146.981 202.295 146.981C186.129 146.981 169.066 144.437 155.304 135.443C148.014 130.678 143.524 123.528 137.256 117.745C135.925 116.514 132.436 112.789 130.511 112.789H130.433C128.656 112.789 126.543 115.48 125.333 116.618C120.969 120.65 117.475 125.481 113.15 129.551C109.304 133.153 104.961 136.192 100.253 138.578C87.4984 145.066 72.8125 147.003 58.6439 147.003C43.1052 147.003 27.0767 143.025 15.7253 131.909C4.86911 121.219 -0.182073 105.485 0.00500788 90.4575C0.153572 78.9198 3.43299 65.8394 14.0691 59.5973C18.372 57.0753 24.32 54.6737 29.3932 55.1442C30.2727 55.1913 31.1236 55.4708 31.8583 55.9538C33.3164 57.0097 33.3384 59.0338 31.4071 59.5207C28.9035 60.1498 26.7466 59.7942 24.3696 61.0689C22.322 62.2195 20.5454 63.7919 19.1588 65.6807C15.0485 71.0693 13.6564 78.1484 13.6564 84.7734C13.6564 101.475 24.8593 128.539 58.4513 128.539C92.0434 128.539 109.623 111.033 109.789 100.704C109.954 90.3754 107.301 78.9307 107.301 78.9307H153.731Z" fill="#8A48E6" />
                                        <path d="M179.873 1.37805C160.84 -2.9985 133.56 3.1232 124.25 18.6928C101.272 20.9194 83.8125 37.4846 83.8125 53.7052C83.8125 71.4959 104.804 87.3117 130.979 87.3117C131.276 87.3117 131.562 87.3117 131.859 87.2789C148.366 87.2789 153.66 92.6675 168.626 94.1118C187.18 95.9007 203.924 95.2059 213.746 67.568C223.953 38.9508 205.668 7.3411 179.873 1.37805Z" fill="#8A48E6" />
                                        <path d="M153.109 90.8346C157.605 92.1695 162.232 93.5043 168.632 94.117C187.186 95.906 203.929 95.2112 213.751 67.5732C218.026 55.576 217.278 43.0591 213.091 32.1177C216.865 43.8468 200.38 61.0084 189.827 60.6638C188.585 60.6474 187.38 61.0765 186.431 61.8723C185.482 62.6681 184.853 63.7773 184.66 64.9965C180.566 88.2087 153.12 90.8346 153.109 90.8346Z" fill="#5224AA" />
                                        <path d="M141.373 31.0455C141.373 31.0455 140.822 26.2531 139.348 23.6163C144.3 23.1458 163.14 29.5684 167.003 33.8027C156.201 30.9142 141.373 31.0455 141.373 31.0455Z" fill="#120C38" />
                                        <path d="M114.928 31.0455C114.928 31.0455 115.478 26.2531 116.953 23.6163C112.001 23.1458 93.1605 29.5684 89.2979 33.8027C100.099 30.9142 114.928 31.0455 114.928 31.0455Z" fill="#120C38" />
                                        <path d="M108.705 60.1768C112.96 60.1768 116.409 56.7478 116.409 52.5179C116.409 48.2879 112.96 44.8589 108.705 44.8589C104.451 44.8589 101.002 48.2879 101.002 52.5179C101.002 56.7478 104.451 60.1768 108.705 60.1768Z" fill="white" />
                                        <path d="M109.816 57.863C112.229 57.863 114.185 55.3206 114.185 52.1844C114.185 49.0482 112.229 46.5059 109.816 46.5059C107.403 46.5059 105.447 49.0482 105.447 52.1844C105.447 55.3206 107.403 57.863 109.816 57.863Z" fill="#120C38" />
                                        <path d="M148.806 60.1768C153.06 60.1768 156.509 56.7478 156.509 52.5179C156.509 48.2879 153.06 44.8589 148.806 44.8589C144.551 44.8589 141.103 48.2879 141.103 52.5179C141.103 56.7478 144.551 60.1768 148.806 60.1768Z" fill="white" />
                                        <path d="M149.918 57.863C152.331 57.863 154.287 55.3206 154.287 52.1844C154.287 49.0482 152.331 46.5059 149.918 46.5059C147.505 46.5059 145.549 49.0482 145.549 52.1844C145.549 55.3206 147.505 57.863 149.918 57.863Z" fill="#120C38" />
                                        <path d="M115.462 99.1012C115.462 99.1012 122.015 112.094 111.544 113.785C101.073 115.475 101.524 100.277 101.524 100.277L106.322 95.124L113.442 96.6175L115.462 99.1012Z" fill="#120C38" />
                                        <path d="M145.5 99.1012C145.5 99.1012 138.946 112.094 149.417 113.785C159.888 115.475 159.443 100.277 159.443 100.277L154.623 95.124L147.503 96.6175L145.5 99.1012Z" fill="#120C38" />
                                        <path d="M10.9385 106.503C5.23807 84.1826 15.1479 73.843 15.1479 73.843C15.9671 70.9043 17.3211 68.1397 19.1426 65.6862C20.5292 63.7974 22.3058 62.225 24.3533 61.0744C26.7304 59.7997 28.8873 60.1553 31.3909 59.5262C33.3222 59.0393 33.3002 57.0151 31.8421 55.9593C31.1074 55.4762 30.2565 55.1967 29.377 55.1496C24.3038 54.6572 18.3723 57.0808 14.0529 59.6028C3.43879 65.8175 0.159368 78.9198 0.00530089 90.4575C-0.187283 105.485 4.8639 121.219 15.7641 131.909C19.3849 135.439 23.5518 138.368 28.106 140.585C27.9354 140.394 16.595 128.659 10.9385 106.503Z" fill="#AB85E5" />
                                        <path d="M11.1574 71.202C12.1704 69.189 12.3703 67.248 11.6039 66.8668C10.8376 66.4855 9.39506 67.8084 8.38206 69.8214C7.36905 71.8344 7.16914 73.7754 7.93553 74.1566C8.70192 74.5378 10.1444 73.215 11.1574 71.202Z" fill="#8A48E6" />
                                        <path d="M5.68536 83.9894C5.99183 81.7592 5.55196 79.8577 4.70288 79.7424C3.85381 79.6271 2.91705 81.3415 2.61058 83.5717C2.30411 85.8019 2.74397 87.7034 3.59305 87.8187C4.44213 87.934 5.37889 86.2196 5.68536 83.9894Z" fill="#8A48E6" />
                                        <path d="M2.99071 104.437C3.84768 104.361 4.37721 102.474 4.17345 100.223C3.96969 97.9718 3.10981 96.2093 2.25284 96.286C1.39588 96.3626 0.866349 98.2495 1.07011 100.5C1.27386 102.751 2.13375 104.514 2.99071 104.437Z" fill="#8A48E6" />
                                        <path d="M7.43911 120.923C7.50102 120.934 7.56429 120.934 7.62619 120.923C8.42404 120.644 8.49557 118.702 7.76926 116.58C7.04294 114.457 5.7939 112.931 4.97405 113.215C4.61639 113.33 4.42381 113.795 4.36328 114.452L7.43911 120.923Z" fill="#8A48E6" />
                                        <path d="M250.023 106.503C255.723 84.1825 245.819 73.8483 245.819 73.8483H245.792C244.972 70.9096 243.618 68.145 241.797 65.6915C240.41 63.8027 238.634 62.2304 236.586 61.0797C234.209 59.8051 232.052 60.1607 229.549 59.5315C227.617 59.0446 227.639 57.0205 229.097 55.9646C229.834 55.4807 230.687 55.2012 231.568 55.155C236.636 54.6626 242.573 57.0861 246.887 59.6081C257.517 65.8174 260.819 78.9197 260.951 90.4574C261.143 105.485 256.092 121.219 245.192 131.909C241.573 135.438 237.408 138.367 232.856 140.585C233.026 140.394 244.367 128.659 250.023 106.503Z" fill="#AB85E5" />
                                        <path d="M253.028 74.1806C253.794 73.7993 253.594 71.8584 252.581 69.8454C251.568 67.8323 250.126 66.5095 249.359 66.8908C248.593 67.272 248.793 69.2129 249.806 71.226C250.819 73.239 252.261 74.5618 253.028 74.1806Z" fill="#8A48E6" />
                                        <path d="M257.367 87.8431C258.216 87.7277 258.656 85.8263 258.349 83.5961C258.043 81.3658 257.106 79.6514 256.257 79.7667C255.408 79.8821 254.968 81.7835 255.275 84.0137C255.581 86.2439 256.518 87.9584 257.367 87.8431Z" fill="#8A48E6" />
                                        <path d="M259.394 100.032C259.609 97.7908 259.091 95.9088 258.238 95.828C257.385 95.7473 256.519 97.4983 256.305 99.7391C256.09 101.98 256.608 103.862 257.461 103.943C258.314 104.023 259.179 102.272 259.394 100.032Z" fill="#8A48E6" />
                                        <path d="M256.603 114.43C256.554 113.773 256.344 113.308 255.992 113.193C255.167 112.909 253.923 114.408 253.192 116.558C252.46 118.708 252.537 120.623 253.335 120.902C253.397 120.912 253.46 120.912 253.522 120.902L256.603 114.43Z" fill="#8A48E6" />
                                        <path d="M131.265 109.708L105.134 130.896C105.838 132.067 114.301 146.504 114.625 146.833C114.95 147.161 120.678 144.984 121.487 144.054C121.606 143.903 121.716 143.746 121.817 143.583C122.382 142.655 122.794 141.643 123.039 140.585C124.001 137.248 125.036 133.905 125.927 130.541C126.788 127.396 127.424 124.195 127.831 120.962C128.018 119.446 128.42 116.585 130.489 116.585C132.558 116.585 132.932 119.435 133.119 120.962C133.55 124.179 134.193 127.364 135.045 130.497C135.936 133.883 136.971 137.221 137.933 140.585C138.171 141.647 138.576 142.664 139.133 143.599C139.254 143.764 139.37 143.906 139.485 144.07C140.283 145 145.994 147.177 146.347 146.849C146.699 146.521 155.15 132.078 155.816 130.913L131.265 109.708Z" fill="#8A48E6" />
                                        <path d="M115.357 139.617C113.643 134.609 112.274 129.491 111.258 124.299C110.158 118.598 109.96 112.767 109.899 106.979V104.73C109.953 103.469 110.138 102.217 110.449 100.994C110.449 100.95 112.337 95.6543 115.479 99.1173C113.707 95.6379 109.486 88.9473 100.039 88.9473C99.8353 88.9473 99.6867 88.9801 99.4886 88.991C96.3498 88.9979 93.3205 90.1393 90.9654 92.2023C87.0862 95.7255 86.3929 101.196 85.9142 106.12C85.2925 112.542 85.8207 118.921 86.2334 125.338L86.3324 126.925C86.7616 133.807 87.0092 141.537 91.1195 147.396C94.2503 151.866 99.2355 154.366 104.639 153.884L104.573 154.01C104.573 154.01 120.568 151.51 121.867 143.556C121.867 143.638 121.773 143.714 121.658 143.791C121.18 144.037 120.668 144.212 120.139 144.311C119.538 144.41 118.92 144.326 118.367 144.07C116.953 143.408 116.166 141.942 115.677 140.541C115.556 140.219 115.462 139.918 115.357 139.617Z" fill="#AB85E5" />
                                        <path d="M145.604 139.617C147.318 134.609 148.688 129.491 149.703 124.299C150.804 118.598 151.007 112.767 151.062 106.979C151.062 106.227 151.062 105.478 151.062 104.73C151.008 103.469 150.824 102.217 150.512 100.994C150.512 100.95 148.625 95.6543 145.483 99.1173C147.255 95.6379 151.475 88.9473 160.923 88.9473C161.126 88.9473 161.275 88.9801 161.473 88.991C164.61 88.9988 167.637 90.1401 169.991 92.2023C173.881 95.7255 174.574 101.196 175.047 106.12C175.675 112.542 175.141 118.921 174.728 125.338L174.629 126.925C174.2 133.807 173.952 141.537 169.848 147.396C166.711 151.866 161.726 154.366 156.323 153.884L156.389 154.01C156.389 154.01 140.393 151.51 139.095 143.556C139.095 143.638 139.188 143.714 139.309 143.791C139.785 144.037 140.295 144.212 140.822 144.311C141.424 144.41 142.042 144.326 142.594 144.07C144.008 143.408 144.795 141.942 145.29 140.541L145.604 139.617Z" fill="#AB85E5" />
                                        <path d="M164.857 111.644C166.613 111.533 167.888 109.135 167.705 106.288C167.522 103.442 165.95 101.225 164.194 101.337C162.438 101.449 161.163 103.846 161.346 106.693C161.529 109.539 163.101 111.756 164.857 111.644Z" fill="#8A48E6" />
                                        <path d="M166.293 128.542C166.801 125.735 165.809 123.208 164.078 122.898C162.346 122.589 160.53 124.613 160.022 127.42C159.514 130.227 160.506 132.754 162.238 133.064C163.97 133.374 165.785 131.349 166.293 128.542Z" fill="#8A48E6" />
                                        <path d="M161.275 148.586C162.71 146.116 162.637 143.405 161.113 142.53C159.59 141.655 157.192 142.949 155.757 145.419C154.323 147.889 154.395 150.6 155.919 151.475C157.443 152.35 159.841 151.056 161.275 148.586Z" fill="#8A48E6" />
                                        <path d="M161.878 94.3984C162.375 93.6936 161.688 92.361 160.342 91.4221C158.996 90.4831 157.502 90.2933 157.004 90.9982C156.507 91.703 157.194 93.0356 158.54 93.9745C159.886 94.9135 161.38 95.1033 161.878 94.3984Z" fill="#8A48E6" />
                                        <path d="M99.6308 106.714C99.8139 103.868 98.5389 101.47 96.783 101.358C95.027 101.246 93.4551 103.463 93.272 106.31C93.0889 109.156 94.3639 111.554 96.1198 111.666C97.8757 111.777 99.4476 109.56 99.6308 106.714Z" fill="#8A48E6" />
                                        <path d="M98.7164 133.079C100.448 132.769 101.44 130.243 100.932 127.435C100.424 124.628 98.6084 122.604 96.8767 122.914C95.145 123.223 94.153 125.75 94.661 128.557C95.169 131.364 96.9847 133.389 98.7164 133.079Z" fill="#8A48E6" />
                                        <path d="M105.042 151.476C106.566 150.601 106.638 147.89 105.204 145.42C103.77 142.95 101.372 141.656 99.8479 142.531C98.3241 143.406 98.2516 146.117 99.686 148.587C101.12 151.057 103.518 152.351 105.042 151.476Z" fill="#8A48E6" />
                                        <path d="M102.422 93.9832C103.768 93.0443 104.455 91.7117 103.958 91.0069C103.46 90.302 101.966 90.4918 100.62 91.4307C99.2745 92.3697 98.5869 93.7023 99.0844 94.4071C99.5819 95.112 101.076 94.9222 102.422 93.9832Z" fill="#8A48E6" />
                                        <path d="M148.895 35.4004C144.562 35.4028 140.389 37.0306 137.211 39.9585C134.032 42.8865 132.082 46.8989 131.749 51.1943H127.05C126.705 46.7826 124.655 42.6751 121.331 39.7334C118.006 36.7917 113.665 35.2444 109.217 35.416C104.77 35.5876 100.562 37.4648 97.4769 40.6538C94.3914 43.8429 92.668 48.0959 92.668 52.5209C92.668 56.9459 94.3914 61.199 97.4769 64.388C100.562 67.5771 104.77 69.4543 109.217 69.6259C113.665 69.7974 118.006 68.2501 121.331 65.3084C124.655 62.3667 126.705 58.2592 127.05 53.8476H131.749C132.011 57.164 133.24 60.3324 135.286 62.9651C137.331 65.5977 140.104 67.5803 143.265 68.6701C146.427 69.7599 149.839 69.9096 153.085 69.101C156.33 68.2924 159.268 66.5605 161.539 64.1173C163.81 61.6741 165.315 58.6256 165.87 55.3451C166.425 52.0646 166.006 48.6943 164.664 45.6469C163.322 42.5995 161.116 40.0072 158.315 38.1873C155.514 36.3674 152.24 35.3989 148.895 35.4004ZM109.905 67.1304C107.005 67.1315 104.17 66.278 101.757 64.6777C99.3451 63.0775 97.464 60.8022 96.3518 58.1395C95.2395 55.4768 94.946 52.5461 95.5083 49.7176C96.0705 46.8891 97.4634 44.2897 99.5109 42.248C101.558 40.2062 104.169 38.8135 107.012 38.246C109.855 37.6785 112.804 37.9615 115.485 39.0594C118.166 40.1573 120.46 42.0207 122.077 44.4142C123.694 46.8078 124.561 49.624 124.569 52.5072C124.571 54.4232 124.193 56.3208 123.457 58.0916C122.721 59.8623 121.641 61.4715 120.279 62.827C118.918 64.1826 117.3 65.258 115.52 65.9917C113.74 66.7254 111.832 67.1031 109.905 67.1031V67.1304ZM148.895 67.1304C145.995 67.1304 143.16 66.276 140.749 64.6751C138.337 63.0741 136.457 60.7985 135.346 58.1357C134.234 55.4729 133.941 52.5424 134.504 49.7142C135.067 46.8861 136.461 44.2873 138.508 42.246C140.556 40.2048 143.166 38.8127 146.009 38.2456C148.852 37.6785 151.8 37.9619 154.482 39.0599C157.163 40.1579 159.456 42.0214 161.073 44.4148C162.689 46.8082 163.556 49.6243 163.564 52.5072C163.566 54.4237 163.188 56.3217 162.452 58.0928C161.716 59.864 160.635 61.4734 159.273 62.829C157.91 64.1846 156.292 65.2599 154.512 65.9933C152.731 66.7267 150.822 67.1038 148.895 67.1031V67.1304Z" fill="#120C38" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='big-block w-full flex flex-col items-start md:col-span-2 lg:col-span-3 gap-4 md:gap-[20px]'>
                    <div className='blocks w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[20px]'>
                        <div className='uchni w-full h-[140px] md:h-[180px] flex items-center'>
                            <div className="w-full h-full bg-white rounded-[20px] flex justify-center items-center flex-col">
                                <div className="text-center text-[#8a48e6] text-2xl md:text-[32px] font-bold font-['Nunito']">{teacher.StudentsAmount}</div>
                                <div className="text-center text-[#120c38] text-lg md:text-2xl font-bold font-['Nunito']">{t('ProfileTeacher_forStudent.Stats.Students')}</div>
                            </div>
                        </div>

                        <div className='rating w-full h-[140px] md:h-[180px] flex items-center'>
                            <div className="w-full h-full bg-white rounded-[20px] flex justify-center items-center flex-col">
                                <div className="text-center text-[#120c38] text-lg md:text-2xl font-bold font-['Nunito'] mb-2">{t('ProfileTeacher_forStudent.Stats.Rating')}</div>

                                <StarRating rating={teacher.Rating} />

                                <div className="text-center text-[#8a48e6] text-lg md:text-2xl font-bold font-['Nunito'] mt-2">{teacher.Rating}</div>
                            </div>
                        </div>

                        <div className='w-full h-[140px] md:h-[180px] flex items-center'>
                            <div className="w-full h-full bg-white rounded-[20px] flex justify-center items-center flex-col p-2">
                                <div className="text-center text-[#8a48e6] text-2xl md:text-[32px] font-bold font-['Nunito']">{teacher.MaterialsAmount}</div>
                                <div className="text-center text-[#120c38] text-sm md:text-lg lg:text-2xl font-bold font-['Nunito']">{t('ProfileTeacher_forStudent.Stats.Materials')}</div>
                            </div>
                        </div>
                    </div>

                    <CourseList courses={courses} userFrom={userFrom} teacher={teacher} user={user} />

                    <Reviews userId={user.UserId} userFrom={userFrom} />
                </div>
            </div>
        </div>
    );
}