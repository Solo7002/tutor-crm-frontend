import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SearchTeachers.css";
import { encryptData } from '../../utils/crypto';
import Dropdown from "./components/Dropdown";

const SearchTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        lessonType: "",
        meetingType: "",
        aboutTeacher: "",
        priceMin: "",
        priceMax: "",
        rating: "desc", // desc = від більшого до меншого, asc = від меншого до більшого
        format: "", // online/offline
        priceSort: "", // new: for price sorting dropdown
        lessonFormat: "", // new: for lesson format dropdown
    });

    const defaultFilters = {
        lessonType: "",
        meetingType: "",
        aboutTeacher: "",
        priceMin: "",
        priceMax: "",
        rating: "desc",
        format: "",
        priceSort: "",
        lessonFormat: "",
    };

    const lessonTypeOptions = [
        { key: "group", value: "Груповий" },
        { key: "solo", value: "Індивідуальний" },
    ];

    const priceSortOptions = [
        { key: "desc", value: "Від більшого" },
        { key: "asc", value: "Від меншого" },
    ];

    const meetingTypeOptions = [
        { key: "offline", value: "Офлайн" },
        { key: "online", value: "Онлайн" },
    ];

    const fetchTeachers = useCallback(async (pageNum = 1) => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                ...filters,
                page: pageNum,
                limit: pageNum === 1 ? 12 : 6, // Load 12 cards initially, then 6 more
            }).toString();

            const response = await axios.get(
                `http://localhost:4000/api/students/searchTeachers?${queryParams}`
            );

            if (response.data.success) {
                if (pageNum === 1) {
                    setTeachers(response.data.data);
                } else {
                    setTeachers(prev => [...prev, ...response.data.data]);
                }
                setHasMore(response.data.hasMore);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            if (pageNum === 1) {
                setTeachers([]);
            }
            setError(err.message || "Failed to fetch teachers.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        setPage(1);
        fetchTeachers(1);
    }, [fetchTeachers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTeachers(nextPage);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        setShowFilters(false);
    };

    // Функция для рендера звезд рейтинга
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        const fractionalPart = (rating || 0) - fullStars;

        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= fullStars;
                    const partialFill = star === fullStars + 1 && fractionalPart > 0;
                    const fillWidth = partialFill ? `${fractionalPart * 100}%` : "0%";

                    return (
                        <div key={star} className="relative w-5 h-5">
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                                    fill="none"
                                    stroke="#8A48E6"
                                    strokeWidth="1"
                                />
                                {(isFilled || partialFill) && (
                                    <path
                                        d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                                        fill="#8A48E6"
                                        style={partialFill ? { clipPath: `inset(0 ${100 - fractionalPart * 100}% 0 0)` } : {}}
                                    />
                                )}
                            </svg>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col bg-[#F6EEFF] search-teachers-page">
            {/* Fixed Top Section */}
            <div className="p-6 pb-0 bg-[#F6EEFF]">
                <div className="flex flex-col-reverse lg:flex-row lg:gap-4">
                    {/* Search and Filters Section */}
                    <div className="flex gap-4 w-full lg:w-[32%] lg:mr-4">
                        <div className="flex flex-1 gap-4 flex-col w-full">
                            {/* Search Input */}
                            <div className="w-full h-12 px-4 py-2 bg-white rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#8a48e6] inline-flex justify-end items-center gap-2.5 search-input">
                                <input
                                    type="text"
                                    placeholder="Шукати"
                                    className="flex-1 text-[#827ead] text-base font-normal font-['Nunito'] bg-transparent border-none outline-none"
                                    name="aboutTeacher"
                                    value={filters.aboutTeacher}
                                    onChange={handleFilterChange}
                                />
                                <div className="w-8 h-8 relative">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M28 28L20 20M4 13.3333C4 14.559 4.24141 15.7727 4.71046 16.905C5.1795 18.0374 5.86699 19.0663 6.73367 19.933C7.60035 20.7997 8.62925 21.4872 9.76162 21.9562C10.894 22.4253 12.1077 22.6667 13.3333 22.6667C14.559 22.6667 15.7727 22.4253 16.905 21.9562C18.0374 21.4872 19.0663 20.7997 19.933 19.933C20.7997 19.0663 21.4872 18.0374 21.9562 16.905C22.4253 15.7727 22.6667 14.559 22.6667 13.3333C22.6667 12.1077 22.4253 10.894 21.9562 9.76162C21.4872 8.62925 20.7997 7.60035 19.933 6.73367C19.0663 5.86699 18.0374 5.1795 16.905 4.71046C15.7727 4.24141 14.559 4 13.3333 4C12.1077 4 10.894 4.24141 9.76162 4.71046C8.62925 5.1795 7.60035 5.86699 6.73367 6.73367C5.86699 7.60035 5.1795 8.62925 4.71046 9.76162C4.24141 10.894 4 12.1077 4 13.3333Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-nowrap gap-2 sm:gap-4 justify-between search-teachers-page-sorts">
                                {/* Filter Button */}
                                <div className="relative">
                                    <button
                                        onClick={toggleFilters}
                                        className="w-12 h-12 mt-[2px] bg-white rounded-full border border-[#D7D7D7] flex items-center justify-center filter-button"
                                    >
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 4H20V6.172C19.9999 6.70239 19.7891 7.21101 19.414 7.586L15 12V19L9 21V12.5L4.52 7.572C4.18545 7.20393 4.00005 6.7244 4 6.227V4Z" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    {/* Filter Popup */}
                                    {showFilters && (
                                        <div className="absolute top-23 left-0 w-[90vw] sm:w-[332px] bg-white rounded-2xl border border-[#D7D7D7] p-6 z-50 shadow-xl filter-popup">
                                            {/* Price Range */}
                                            <div className="mb-8">
                                                <h3 className="text-[#120C38] text-2xl font-bold font-['Nunito'] flex gap-3 mb-4">
                                                    <button
                                                        onClick={toggleFilters}
                                                        className="w-12 h-12 mt-[2px] bg-white hidden sorts-back-btn"
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5 12H19M5 12L11 18M5 12L11 6" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                    </button><span>Вартість навчання</span>
                                                </h3>
                                                <div className="flex mt-6">
                                                    <input
                                                        type="number"
                                                        placeholder="Мінімальна"
                                                        className="price-input w-[136px]"
                                                        name="priceMin"
                                                        value={filters.priceMin}
                                                        onChange={handleFilterChange}
                                                    />
                                                    <span className="mt-1 text-[#7630c5] text-3xl">-</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Максимальна"
                                                        className="price-input w-[136px]"
                                                        name="priceMax"
                                                        value={filters.priceMax}
                                                        onChange={handleFilterChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="mb-8">
                                                <h3 className="text-[#120C38] text-2xl font-bold font-['Nunito'] mb-4">Рейтинг</h3>
                                                <div className="space-y-4">
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <span className="text-[#120C38] text-sm font-normal font-['Mulish']">Від більшого до меншого</span>
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            value="desc"
                                                            checked={filters.rating === "desc"}
                                                            onChange={handleFilterChange}
                                                            className="hidden"
                                                        />
                                                        <div className={`radio-button ${filters.rating === "desc" ? "checked" : ""}`} />
                                                    </label>
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <span className="text-[#120C38] text-sm font-normal font-['Mulish']">Від меншого до більшого</span>
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            value="asc"
                                                            checked={filters.rating === "asc"}
                                                            onChange={handleFilterChange}
                                                            className="hidden"
                                                        />
                                                        <div className={`radio-button ${filters.rating === "asc" ? "checked" : ""}`} />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Format */}
                                            <div className="mb-8">
                                                <h3 className="text-[#120C38] text-2xl font-bold font-['Nunito'] mb-4">Формат</h3>
                                                <div className="space-y-4">
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <span className="text-[#120C38] text-sm font-normal font-['Mulish']">Онлайн</span>
                                                        <input
                                                            type="radio"
                                                            name="format"
                                                            value="online"
                                                            checked={filters.format === "online"}
                                                            onChange={handleFilterChange}
                                                            className="hidden"
                                                        />
                                                        <div className={`radio-button ${filters.format === "online" ? "checked" : ""}`} />
                                                    </label>
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <span className="text-[#120C38] text-sm font-normal font-['Mulish']">Офлайн</span>
                                                        <input
                                                            type="radio"
                                                            name="format"
                                                            value="offline"
                                                            checked={filters.format === "offline"}
                                                            onChange={handleFilterChange}
                                                            className="hidden"
                                                        />
                                                        <div className={`radio-button ${filters.format === "offline" ? "checked" : ""}`} />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Reset Button */}
                                            <button
                                                onClick={resetFilters}
                                                className="w-full h-12 bg-[#8a48e6] text-white rounded-full font-bold font-['Nunito'] hover:bg-[#7339cc] transition-colors"
                                            >
                                                Скинути
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Price Sort Dropdown */}
                                <div className="h-12 w-[12vw] mx-1 mt-[2px] mobile-dropdown-searchteacher">
                                    <Dropdown
                                        textAll="За ціною"
                                        options={priceSortOptions.map(option => option.value)}
                                        onSelect={(value) => {
                                            const selectedOption = priceSortOptions.find(opt => opt.value === value) || { key: "" };
                                            handleFilterChange({ target: { name: "priceSort", value: selectedOption.key } });
                                        }}
                                    />
                                </div>

                                {/* Lesson Type Dropdown */}
                                <div className="h-12 w-[12vw] mx-1 mt-[2px] mobile-dropdown-searchteacher">
                                    <Dropdown
                                        textAll="Вид занять"
                                        options={lessonTypeOptions.map(option => option.value)}
                                        onSelect={(value) => {
                                            const selectedOption = lessonTypeOptions.find(opt => opt.value === value) || { key: "" };
                                            handleFilterChange({ target: { name: "lessonType", value: selectedOption.key } });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="flex bg-[#120C38] z-[0] rounded-lg shadow-md h-[108px] w-full lg:w-[65%] bg-pattern overflow-hidden relative" style={{
                        backgroundRepeat: "repeat",
                    }}>
                        <div className="w-full lg:w-[80%] text-white px-5 py-2" style={{ fontFamily: "Mulish", fontWeight: "400", fontSize: "15pt", lineHeight: "18.83px", letterSpacing: "-0.5%" }}>
                            <div className="text-xl lg:text-2xl font-bold my-2" style={{ fontFamily: "Nunito", fontStyle: "normal", fontWeight: "700", lineHeight: "44px", letterSpacing: "-0.005em", color: "#FFFFFF" }}>Ваш ключ до успіху в навчанні!</div>
                            <p className="text-sm lg:text-base" style={{ fontFamily: "Nunito", fontStyle: "normal", fontWeight: "400", color: "#FFFFFF" }}>Прокачайте свої знання з найкращими репетиторами!</p>
                        </div>
                        <svg className="hidden lg:block absolute right-10 top-[10px]" style={{ width: "232px", height: "137px" }} viewBox="0 0 232 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_677_936)">
                                <path d="M93.7265 72.7827C93.7265 72.7827 95.5801 84.3706 89.7794 88.9697C85.0351 92.722 79.2638 94.5178 73.5706 96.2698C67.2417 98.2166 60.5508 99.3797 53.9234 98.5864C37.9592 96.6835 26.3382 81.4262 29.9135 65.5215C31.102 60.2167 34.7409 48.2979 42.0236 48.2931C45.2566 48.2931 43.1535 44.5943 41.0454 44.2877C39.9628 44.1946 38.8733 44.3512 37.8614 44.7452C28.2212 47.8551 23.0123 55.8804 19.7109 64.9569C16.9673 72.3719 16.4073 80.4119 18.0968 88.1326C23.1786 110.719 51.6932 115.445 71.1349 112.953C77.2082 112.185 83.1631 110.675 88.8648 108.456C93.5553 106.626 98.9696 104.563 101.508 99.9102C105.856 91.9481 103.954 70.3737 103.954 70.3737L93.7265 72.7827Z" fill="#211A54" />
                                <path d="M141.403 75.2794C141.403 75.2794 139.545 86.8624 145.35 91.4615C150.095 95.2186 155.866 97.0096 161.559 98.7617C167.888 100.708 174.579 101.872 181.206 101.078C197.17 99.1753 208.791 83.918 205.216 68.0133C204.028 62.7085 200.389 50.7898 193.106 50.7849C189.868 50.7849 191.976 47.0861 194.084 46.7844C195.166 46.692 196.255 46.8468 197.268 47.237C206.908 50.3469 212.117 58.3771 215.419 67.4488C218.175 74.8619 218.745 82.9045 217.062 90.6293C211.98 113.216 183.471 117.942 164.029 115.479C157.95 114.703 151.991 113.187 146.284 110.963C141.594 109.133 136.18 107.069 133.641 102.417C129.293 94.4594 131.196 72.8801 131.196 72.8801L141.403 75.2794Z" fill="#211A54" />
                                <path d="M136.645 70.2277C136.645 70.2277 134.263 80.3798 134.39 89.578C134.517 98.7762 150.158 114.34 180.023 114.34C209.887 114.34 219.836 90.2837 219.836 75.4059C219.836 69.5123 218.623 63.239 214.945 58.4209C213.712 56.7406 212.133 55.3418 210.313 54.3182C208.2 53.1842 206.278 53.5005 204.057 52.9409C202.341 52.5077 202.36 50.707 203.656 49.7677C204.309 49.338 205.066 49.0894 205.847 49.0474C210.357 48.6094 215.629 50.7654 219.469 53.009C228.923 58.5425 231.838 70.1985 231.97 80.4625C232.141 93.8316 227.647 107.828 217.962 117.338C207.882 127.227 193.635 130.766 179.813 130.766C165.443 130.766 150.276 128.503 138.043 120.502C131.563 116.263 127.572 109.902 122.001 104.758C120.817 103.663 117.716 100.348 116.004 100.348H115.936C114.356 100.348 112.478 102.743 111.402 103.755C107.523 107.342 104.418 111.639 100.573 115.26C97.1539 118.464 93.2937 121.168 89.1088 123.29C77.7715 129.062 64.7174 130.785 52.123 130.785C38.3108 130.785 24.0633 127.247 13.9732 117.358C4.32322 107.848 -0.166726 93.8511 -0.000431367 80.482C0.131626 70.218 3.04667 58.5815 12.501 53.0285C16.3257 50.7849 21.6129 48.6484 26.1224 49.0669C26.9042 49.1088 27.6606 49.3575 28.3136 49.7872C29.6097 50.7265 29.6293 52.5272 27.9125 52.9603C25.6871 53.52 23.7699 53.2037 21.6569 54.3376C19.8369 55.3612 18.2577 56.76 17.0252 58.4403C13.3716 63.2341 12.1342 69.5317 12.1342 75.4254C12.1342 90.2837 22.0922 114.36 51.9518 114.36C81.8114 114.36 97.4382 98.786 97.5849 89.5975C97.7317 80.409 95.3742 70.2277 95.3742 70.2277H136.645Z" fill="#8A48E6" />
                                <path d="M159.881 1.23618C142.963 -2.65725 118.714 2.78869 110.438 16.6396C90.0133 18.6203 74.4941 33.357 74.4941 47.787C74.4941 63.6138 93.1533 77.6836 116.42 77.6836C116.684 77.6836 116.938 77.6836 117.202 77.6544C131.875 77.6544 136.581 82.4482 149.884 83.7331C166.377 85.3245 181.26 84.7064 189.99 60.1194C199.063 34.6613 182.81 6.54098 159.881 1.23618Z" fill="#8A48E6" />
                                <path d="M136.092 80.8178C140.088 82.0053 144.201 83.1928 149.889 83.7379C166.382 85.3293 181.265 84.7113 189.996 60.1243C193.796 49.4514 193.131 38.3162 189.409 28.5826C193.321 40.7496 172.74 59.4916 164.592 52.4299C164.611 78.0876 136.106 80.8178 136.092 80.8178Z" fill="#211A54" />
                                <path d="M125.659 27.6288C125.659 27.6288 125.17 23.3655 123.859 21.0197C128.261 20.6011 145.008 26.3147 148.442 30.0816C138.841 27.512 125.659 27.6288 125.659 27.6288Z" fill="#211A54" />
                                <path d="M102.153 27.6288C102.153 27.6288 102.642 23.3655 103.953 21.0197C99.5514 20.6011 82.8046 26.3147 79.3711 30.0816C88.9721 27.512 102.153 27.6288 102.153 27.6288Z" fill="#211A54" />
                                <path d="M96.6218 53.5444C100.404 53.5444 103.469 50.4938 103.469 46.7309C103.469 42.9679 100.404 39.9174 96.6218 39.9174C92.8401 39.9174 89.7744 42.9679 89.7744 46.7309C89.7744 50.4938 92.8401 53.5444 96.6218 53.5444Z" fill="white" />
                                <path d="M97.609 51.4858C99.7538 51.4858 101.492 49.224 101.492 46.434C101.492 43.6441 99.7538 41.3823 97.609 41.3823C95.4643 41.3823 93.7256 43.6441 93.7256 46.434C93.7256 49.224 95.4643 51.4858 97.609 51.4858Z" fill="#211A54" />
                                <path d="M132.267 53.5444C136.049 53.5444 139.115 50.4938 139.115 46.7309C139.115 42.9679 136.049 39.9174 132.267 39.9174C128.486 39.9174 125.42 42.9679 125.42 46.7309C125.42 50.4938 128.486 53.5444 132.267 53.5444Z" fill="white" />
                                <path d="M133.256 51.4858C135.4 51.4858 137.139 49.224 137.139 46.434C137.139 43.6441 135.4 41.3823 133.256 41.3823C131.111 41.3823 129.372 43.6441 129.372 46.434C129.372 49.224 131.111 51.4858 133.256 51.4858Z" fill="#211A54" />
                                <path d="M102.628 88.1716C102.628 88.1716 108.453 99.7302 99.1454 101.234C89.8378 102.738 90.2389 89.2179 90.2389 89.2179L94.5038 84.6334L100.833 85.9621L102.628 88.1716Z" fill="#211A54" />
                                <path d="M129.327 88.1716C129.327 88.1716 123.502 99.7302 132.81 101.234C142.117 102.738 141.721 89.2179 141.721 89.2179L137.437 84.6334L131.108 85.9621L129.327 88.1716Z" fill="#211A54" />
                                <path d="M9.71826 94.7562C4.65118 74.8998 13.4599 65.7015 13.4599 65.7015C14.1881 63.0872 15.3916 60.6278 17.0107 58.4452C18.2433 56.7649 19.8225 55.3661 21.6425 54.3425C23.7554 53.2085 25.6727 53.5248 27.8981 52.9652C29.6149 52.532 29.5953 50.7313 28.2992 49.792C27.6462 49.3623 26.8898 49.1137 26.108 49.0717C21.5985 48.6337 16.326 50.7897 12.4866 53.0333C3.05182 58.562 0.136777 70.2179 -0.000170911 80.482C-0.171356 93.851 4.31859 107.848 14.0077 117.358C17.2262 120.498 20.9301 123.104 24.9782 125.076C24.8266 124.906 14.7462 114.467 9.71826 94.7562Z" fill="#AB85E5" />
                                <path d="M9.91282 63.3522C10.8133 61.5614 10.991 59.8347 10.3097 59.4956C9.6285 59.1564 8.34629 60.3332 7.44584 62.124C6.54539 63.9148 6.36768 65.6415 7.04892 65.9807C7.73016 66.3198 9.01237 65.143 9.91282 63.3522Z" fill="#8A48E6" />
                                <path d="M5.04866 74.728C5.32108 72.744 4.93008 71.0525 4.17535 70.9499C3.42062 70.8473 2.58795 72.3725 2.31553 74.3565C2.04311 76.3405 2.4341 78.032 3.18883 78.1346C3.94356 78.2372 4.77624 76.7121 5.04866 74.728Z" fill="#8A48E6" />
                                <path d="M3.08835 92.4889C3.84667 92.417 4.30675 90.7428 4.11596 88.7493C3.92518 86.7559 3.15578 85.1982 2.39747 85.27C1.63915 85.3419 1.17907 87.0161 1.36986 89.0096C1.56064 91.003 2.33004 92.5607 3.08835 92.4889Z" fill="#8A48E6" />
                                <path d="M222.237 94.7563C227.305 74.8998 218.501 65.7064 218.501 65.7064H218.476C217.748 63.0921 216.545 60.6327 214.925 58.45C213.693 56.7698 212.114 55.371 210.294 54.3473C208.181 53.2134 206.263 53.5297 204.038 52.97C202.321 52.5369 202.341 50.7362 203.637 49.7969C204.291 49.3664 205.05 49.1177 205.833 49.0766C210.338 48.6386 215.615 50.7946 219.45 53.0382C228.899 58.562 231.834 70.2179 231.951 80.482C232.122 93.851 227.632 107.848 217.943 117.358C214.726 120.497 211.024 123.103 206.978 125.076C207.129 124.906 217.21 114.467 222.237 94.7563Z" fill="#AB85E5" />
                                <path d="M224.908 66.0021C225.59 65.663 225.412 63.9363 224.511 62.1455C223.611 60.3547 222.329 59.1779 221.648 59.517C220.966 59.8562 221.144 61.5828 222.044 63.3737C222.945 65.1645 224.227 66.3413 224.908 66.0021Z" fill="#8A48E6" />
                                <path d="M228.766 78.1564C229.521 78.0538 229.912 76.3623 229.639 74.3783C229.367 72.3943 228.534 70.8691 227.78 70.9717C227.025 71.0743 226.634 72.7658 226.906 74.7498C227.179 76.7339 228.011 78.2591 228.766 78.1564Z" fill="#8A48E6" />
                                <path d="M230.568 88.9994C230.759 87.006 230.299 85.3318 229.54 85.2599C228.782 85.188 228.013 86.7458 227.822 88.7392C227.631 90.7326 228.091 92.4069 228.85 92.4787C229.608 92.5506 230.377 90.9929 230.568 88.9994Z" fill="#8A48E6" />
                                <path d="M102.535 124.215C101.011 119.76 99.7936 115.207 98.891 110.588C97.9128 105.517 97.7367 100.329 97.6829 95.1797V93.1795C97.7309 92.0577 97.8948 90.9438 98.172 89.8555C98.172 89.8165 99.8496 85.1055 102.642 88.1861C101.067 85.0909 97.3161 79.1388 88.9182 79.1388C88.7372 79.1388 88.6052 79.168 88.4291 79.1777C85.639 79.1839 82.9464 80.1992 80.8529 82.0345C77.4048 85.1687 76.7885 90.0355 76.363 94.4156C75.8103 100.129 76.2799 105.804 76.6467 111.513L76.7347 112.924C77.1162 119.046 77.3363 125.923 80.9899 131.136C83.7729 135.112 88.2041 137.336 93.0071 136.908L92.9484 137.019C92.9484 137.019 107.167 134.795 108.321 127.719C108.321 127.792 108.238 127.86 108.135 127.928C107.71 128.147 107.255 128.303 106.785 128.391C106.25 128.479 105.701 128.404 105.21 128.177C103.953 127.588 103.254 126.283 102.818 125.037C102.711 124.75 102.628 124.483 102.535 124.215Z" fill="#AB85E5" />
                                <path d="M129.421 124.215C130.945 119.76 132.162 115.207 133.065 110.588C134.043 105.517 134.224 100.329 134.273 95.1797C134.273 94.5113 134.273 93.8446 134.273 93.1795C134.225 92.0577 134.061 90.9438 133.784 89.8555C133.784 89.8165 132.106 85.1055 129.313 88.1861C130.888 85.0909 134.64 79.1388 143.037 79.1388C143.218 79.1388 143.35 79.168 143.526 79.1777C146.315 79.1846 149.006 80.1999 151.098 82.0345C154.556 85.1687 155.172 90.0355 155.593 94.4156C156.15 100.129 155.676 105.804 155.309 111.513L155.221 112.924C154.839 119.046 154.619 125.923 150.971 131.136C148.183 135.112 143.751 137.336 138.949 136.908L139.007 137.019C139.007 137.019 124.789 134.795 123.635 127.719C123.635 127.792 123.718 127.86 123.826 127.928C124.249 128.147 124.702 128.303 125.171 128.391C125.705 128.479 126.254 128.404 126.745 128.177C128.002 127.588 128.702 126.283 129.142 125.037L129.421 124.215Z" fill="#AB85E5" />
                                <path d="M146.535 99.3302C148.096 99.2309 149.229 97.0976 149.066 94.5654C148.903 92.0333 147.506 90.0611 145.945 90.1605C144.384 90.2598 143.251 92.3931 143.414 94.9252C143.577 97.4574 144.974 99.4295 146.535 99.3302Z" fill="#8A48E6" />
                                <path d="M143.886 83.9879C144.329 83.3609 143.717 82.1754 142.521 81.3401C141.325 80.5048 139.997 80.336 139.555 80.963C139.112 81.5901 139.724 82.7755 140.92 83.6108C142.116 84.4461 143.444 84.615 143.886 83.9879Z" fill="#8A48E6" />
                                <path d="M88.4271 94.3959C88.5801 91.8585 87.4363 89.7259 85.8723 89.6326C84.3083 89.5392 82.9164 91.5204 82.7634 94.0577C82.6104 96.5951 83.7542 98.7277 85.3182 98.821C86.8822 98.9144 88.2741 96.9332 88.4271 94.3959Z" fill="#8A48E6" />
                                <path d="M91.0369 83.6189C92.2331 82.7836 92.8443 81.5981 92.4021 80.9711C91.9599 80.344 90.6316 80.5128 89.4354 81.3481C88.2392 82.1835 87.628 83.3689 88.0703 83.996C88.5125 84.623 89.8407 84.4542 91.0369 83.6189Z" fill="#8A48E6" />
                                <path d="M132.345 31.5027C128.494 31.5049 124.785 32.953 121.96 35.5577C119.134 38.1624 117.401 41.7319 117.105 45.5531H112.928C112.621 41.6284 110.799 37.9744 107.844 35.3574C104.889 32.7404 101.03 31.3639 97.0767 31.5166C93.1236 31.6692 89.3834 33.3392 86.6408 36.1762C83.8982 39.0132 82.3662 42.7968 82.3662 46.7333C82.3662 50.6698 83.8982 54.4534 86.6408 57.2904C89.3834 60.1274 93.1236 61.7973 97.0767 61.95C101.03 62.1027 104.889 60.7261 107.844 58.1092C110.799 55.4922 112.621 51.8382 112.928 47.9135H117.105C117.338 50.8638 118.43 53.6825 120.249 56.0245C122.067 58.3665 124.532 60.1302 127.342 61.0997C130.152 62.0692 133.185 62.2025 136.07 61.4831C138.955 60.7638 141.566 59.223 143.585 57.0495C145.603 54.876 146.941 52.1641 147.434 49.2457C147.928 46.3273 147.555 43.3291 146.363 40.6181C145.17 37.9071 143.209 35.6009 140.719 33.9819C138.23 32.3629 135.32 31.5014 132.345 31.5027ZM97.6877 59.73C95.11 59.731 92.5899 58.9717 90.4456 57.5481C88.3014 56.1245 86.6294 54.1004 85.6407 51.7317C84.652 49.3629 84.3911 46.7557 84.8909 44.2394C85.3907 41.7232 86.6288 39.4107 88.4488 37.5943C90.2688 35.7779 92.589 34.539 95.1162 34.0342C97.6435 33.5293 100.264 33.7811 102.648 34.7578C105.032 35.7345 107.071 37.3922 108.508 39.5215C109.945 41.6508 110.715 44.1562 110.722 46.7211C110.724 48.4256 110.388 50.1137 109.734 51.689C109.08 53.2643 108.12 54.6958 106.91 55.9017C105.699 57.1076 104.262 58.0643 102.679 58.717C101.097 59.3697 99.4007 59.7057 97.6877 59.7057V59.73ZM132.345 59.73C129.768 59.73 127.248 58.9699 125.105 57.5457C122.961 56.1215 121.29 54.0971 120.302 51.7283C119.314 49.3594 119.054 46.7524 119.554 44.2364C120.054 41.7205 121.293 39.4085 123.113 37.5926C124.933 35.7767 127.253 34.5383 129.781 34.0338C132.308 33.5293 134.928 33.7814 137.312 34.7582C139.695 35.7351 141.734 37.3928 143.171 39.522C144.608 41.6512 145.378 44.1564 145.385 46.7211C145.387 48.426 145.051 50.1145 144.396 51.6901C143.742 53.2657 142.782 54.6975 141.571 55.9034C140.359 57.1094 138.921 58.066 137.338 58.7184C135.755 59.3709 134.059 59.7063 132.345 59.7057V59.73Z" fill="#211A54" />
                            </g>
                            <defs>
                                <clipPath id="clip0_677_936">
                                    <rect width="232" height="137" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-0">
                {/* Teacher Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 teacher-cards-grid">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher.TeacherId}
                            className="bg-white min-h-[205px] max-h-[250px] w-full rounded-2xl border border-[#8a48e6] p-4 hover:shadow-lg transition-shadow teacher-card"
                        >
                            {/* Teacher Info */}
                            <div className="flex items-start space-x-3 mb-4">
                                <img
                                    className="w-16 h-16 rounded-full object-cover"
                                    src={teacher.ImagePathUrl || `https://ui-avatars.com/api/?name=${teacher.FullName}&background=random&size=86`}
                                    alt="profile"
                                />
                                <div className="flex-grow">
                                    <div className="mt-1">{renderStars(teacher.Rating)}</div>
                                    <h3 className="text-[#120c38] text-lg font-bold font-['Nunito'] mb-1">
                                        {teacher.FullName || "Волкова Надія Миколаївна"}
                                    </h3>
                                    <p className="text-[#827fae] text-sm font-normal font-['Lato']">
                                        {teacher.SubjectName || "Математика"}
                                    </p>
                                </div>
                            </div>

                            {/* Teacher Description */}
                            <p className="text-[#6f6f6f] text-sm font-normal font-['Mulish'] mb-4 line-clamp-3">
                                {teacher.AboutTeacher ||
                                    "Привіт! Я, Надія Волкова, вчитель математики та фізики. Я маю власну методику навчання, а також розробила авторські матеріали що гарантує якісне засвоєння нових знань."}
                            </p>

                            {/* Price and View Button */}
                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-black text-xl font-bold font-['Nunito']">
                                    Від {teacher.LessonPrice} грн
                                </div>
                                <Link
                                    to={`/student/teacher_profile/${encryptData(teacher.TeacherId)}`}
                                    className="px-6 py-2 bg-[#8a48e6] text-white rounded-full text-sm font-bold font-['Nunito'] hover:bg-[#7339cc] transition-colors"
                                >
                                    Переглянути
                                </Link>
                            </div>
                        </div>
                    ))}
                    {/* Load More Button */}
                    {hasMore && !loading && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center items-center mt-8 mb-6 more-btn">
                            <button
                                onClick={loadMore}
                                className="w-full sm:w-auto px-8 py-3 bg-[#8a48e6] text-white rounded-full text-base font-bold font-['Nunito'] hover:bg-[#7339cc] transition-colors"
                            >
                                Переглянути більше
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <p className="text-center mt-6 loading-pulse">Загрузка...</p>
                )}
                {error && <p className="text-center mt-6 text-red-500">{error}</p>}
                {teachers.length === 0 && !loading && !error && (
                    <p className="text-center mt-6 text-gray-500">
                        Немає доступних викладачів
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchTeachers;
