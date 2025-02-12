import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "tailwindcss/tailwind.css";

const Navbar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const getDefaultActiveNavItem = () => {
        switch (location.pathname) {
            case "/StudentHome":
                return "home";
            case "/StudentHometask":
                return "task";
            case "/StudentMaterials":
                return "test";
            case "/calendar":
                return "calendar";
            case "/library":
                return "library";
            case "/reviews":
                return "review";
            case "/payments":
                return "pay";
            case "/map":
                return "map";
            case "/info":
                return "info";
            case "/settings":
                return "settings";
            case "/profile":
                return "profile";
            default:
                return "home";
        }
    };

    const [activeNavItem, setActiveNavItem] = useState(getDefaultActiveNavItem());

    const handleNavItemClick = (navItem) => {
        setActiveNavItem(navItem);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 w-24 ${isSidebarOpen ? "w-[274px]" : ""
                    } flex flex-col z-50`}
            >
                <div className="pl-7 pt-5">
                    <NavItem
                        iconUrl="../../../assets/navbarIcons/burgerIcon.png"
                        text="Меню"
                        isOpen={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        noBorder
                        blackText
                        group="menu"
                        textStyle={{ fontSize: '24px', fontFamily: 'Nunito', fontWeight: '700' }}
                    />
                </div>
                {/* Profile Section */}
                <div className="ml-7 mb-[40px] pl-8 h-[60px]">
                    <Link to="/profile">
                        <button
                            onClick={() => handleNavItemClick("profile")}
                            style={{
                                width: "60px",
                                height: "60px",
                                position: "absolute",
                                left: "18px",
                                top: "110px",
                                borderRadius: "50%",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src="../../../assets/images/avatar.jpg"
                                alt="Avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                            />
                        </button>
                        {isSidebarOpen && (
                            <div className="absolute left-24 top-28">
                                <p
                                    style={{
                                        fontFamily: "Nunito",
                                        fontWeight: "700",
                                        fontSize: "15px",
                                        lineHeight: "20px",
                                        letterSpacing: "-0.005em",
                                        color: "#827FAE",
                                        margin: "5px"
                                    }}
                                >
                                    Ім’я студента
                                </p>
                                <p
                                    style={{
                                        fontFamily: "Lato",
                                        fontWeight: "400",
                                        fontSize: "15px",
                                        lineHeight: "18px",
                                        letterSpacing: "-0.005em",
                                        color: "#827FAE",
                                        margin: "5px"
                                    }}
                                >
                                    Рейтинг: 11
                                </p>
                            </div>
                        )}
                    </Link>
                </div>
                <nav className="flex-grow p-7 flex flex-col space-y-6">
                    <Link to="/StudentHome">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/homeIcon.png"
                            text="Головна"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'home'}
                            onClick={() => handleNavItemClick('home')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/StudentHometask">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/book3Icon.png"
                            text="Завдання"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'task'}
                            onClick={() => handleNavItemClick('task')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/StudentTests">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/testIcon.png"
                            text="Тести"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'test'}
                            onClick={() => handleNavItemClick('test')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/calendar">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/calendarIcon.png"
                            text="Розклад"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'calendar'}
                            onClick={() => handleNavItemClick('calendar')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>

                    <Link to="/StudentMaterials">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/book2Icon.png"
                            text="Бібліотека"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'library'}
                            onClick={() => handleNavItemClick('library')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/StudentReview">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/messageIcon.png"
                            text="Відгуки"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'review'}
                            onClick={() => handleNavItemClick('review')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/StudentPay">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/payIcon.png"
                            text="Оплата"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'pay'}
                            onClick={() => handleNavItemClick('pay')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/StudentMap">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/mapIcon.png"
                            text="Мапа"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'map'}
                            onClick={() => handleNavItemClick('map')}
                            group="main"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                </nav>
                <div className="p-7 flex flex-col justify-end space-y-4">
                    <Link to="/StudentInfo">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/questionIcon.png"
                            text="Інформація"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'info'}
                            onClick={() => handleNavItemClick('info')}
                            noBorder
                            blackText
                            group="footer"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                    <Link to="/StudentSettings">
                        <NavItem
                            iconUrl="../../../assets/navbarIcons/settingsIcon.png"
                            text="Налаштування"
                            isOpen={isSidebarOpen}
                            isActive={activeNavItem === 'settings'}
                            onClick={() => handleNavItemClick('settings')}
                            noBorder
                            blackText
                            group="footer"
                            textStyle={{ fontSize: '15px', fontFamily: 'Nunito', fontWeight: '700' }}
                        />
                    </Link>
                </div>
            </div>
            <div className="flex-1 flex flex-col ml-24">
                {/* Top Navbar */}
                <header className="h-20 flex items-center justify-between bg-white shadow-md px-4">
                    <span
                        className="text-lg font-semibold pl-8"
                        style={{ fontSize: '32px', fontFamily: 'Nunito', fontWeight: '700', color: '#120C38' }}
                    >
                        Головна
                    </span>
                    <div className="flex space-x-8">
                        <Link to="/">
                            <button
                                className="p-2 rounded-full border border-gray-300 hover:bg-purple-500 transition-all duration-300"
                                onMouseEnter={(e) => {
                                    const icon = e.target.querySelector('img');
                                    if (icon) icon.style.filter = 'brightness(0) invert(1)';
                                }}
                                onMouseLeave={(e) => {
                                    const icon = e.target.querySelector('img');
                                    if (icon) icon.style.filter = 'none';
                                }}
                            >
                                <img
                                    src="../../../assets/navbarIcons/languageIcon.png"
                                    alt="Language"
                                    className="h-5 w-5 transition-all duration-300"
                                />
                            </button>
                        </Link>
                        <Link to="/">
                            <button
                                className="p-2 rounded-full border border-gray-300 hover:bg-purple-500 transition-all duration-300"
                                onMouseEnter={(e) => {
                                    const icon = e.target.querySelector('img');
                                    if (icon) icon.style.filter = 'brightness(0) invert(1)';
                                }}
                                onMouseLeave={(e) => {
                                    const icon = e.target.querySelector('img');
                                    if (icon) icon.style.filter = 'none';
                                }}
                            >
                                <img
                                    src="../../../assets/navbarIcons/sunIcon.png"
                                    alt="Theme"
                                    className="h-5 w-5 transition-all duration-300"
                                />
                            </button>
                        </Link>
                        <Link to="/">
                            <button
                                className="p-2 rounded-full border border-gray-300 hover:bg-purple-500 transition-all duration-300"
                                onMouseEnter={(e) => {
                                    const icon = e.target.querySelector('img');
                                    if (icon) icon.style.filter = 'brightness(0) invert(1)';
                                }}
                                onMouseLeave={(e) => {
                                    const icon = e.target.querySelector('img');
                                    if (icon) icon.style.filter = 'none';
                                }}
                            >
                                <img
                                    src="../../../assets/navbarIcons/bellIcon.png"
                                    alt="Notifications"
                                    className="h-5 w-5 transition-all duration-300"
                                />
                            </button>
                        </Link>
                        <Link to="/">
                            <button
                                className="p-2 rounded-full border border-gray-300 hover:bg-purple-500 transition-all duration-300"
                            >
                                <img
                                    src="../../../assets/navbarIcons/exitIcon.png"
                                    alt="LogOut"
                                    className="h-5 w-5 transition-all duration-300"
                                />
                            </button>
                        </Link>
                    </div>
                </header>
                {/* Content Area */}
                <div
                    className={`flex-1 flex flex-col ml-24 transition-all duration-300 ${isSidebarOpen ? "bg-gray-800/20 backdrop-blur-sm" : ""
                        }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ iconUrl, text, isOpen, isActive, onClick, noBorder, blackText, group, textStyle }) => {
    const baseButtonStyle = {
        backgroundColor: isActive ? '#8A48E6' : 'white',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        width: isOpen ? '228px' : '40px',
        justifyContent: isOpen ? 'flex-start' : 'center',
        border: noBorder ? 'none' : '1px solid #ccc',
        transition: 'background-color 0.3s, color 0.3s',
        borderRadius: '9999px',
        cursor: 'pointer',
    };

    const textStyles = {
        menu: {
            default: { color: '#120C38' },
            hover: { color: '#120C38' },
        },
        main: {
            default: isActive ? 'white' : '#827FAE',
            hover: isActive ? 'white' : '#120C38',
        },
        footer: {
            default: isActive ? 'white' : '#120C38',
            hover: 'white',
        },
    };

    const iconStyles = {
        menu: {
            default: isActive ? 'brightness(0) invert(1)' : 'grayscale(1)',
            hover: isActive ? 'brightness(0) invert(1)' : 'grayscale(1)',
        },
        main: {
            default: isActive ? 'brightness(0) invert(1)' : 'grayscale(1)',
            hover: isActive ? 'brightness(0) invert(1)' : 'none',
        },
        footer: {
            default: isActive ? 'brightness(0) invert(1)' : 'grayscale(1)',
            hover: 'brightness(0) invert(1)',
        },
    };

    const hoverBackground = {
        menu: '#8A48E6',
        main: isActive ? '#8A48E6' : '#E5E7EB',
        footer: '#8A48E6',
    };

    return (
        <button
            className="flex items-center space-x-3 rounded-full"
            style={{
                ...baseButtonStyle,
                backgroundColor: isActive ? '#8A48E6' : 'white',
                color: textStyles[group]?.default || 'black',
            }}
            onMouseEnter={(e) => {
                if (group !== 'menu') {
                    e.target.style.backgroundColor = hoverBackground[group];
                    e.target.style.color = textStyles[group]?.hover || 'black';

                    const icon = e.target.querySelector('img');
                    if (icon) icon.style.filter = iconStyles[group]?.hover;
                }
            }}
            onMouseLeave={(e) => {
                if (group !== 'menu') {
                    e.target.style.backgroundColor = isActive ? '#8A48E6' : 'white';
                    e.target.style.color = textStyles[group]?.default || 'black';

                    const icon = e.target.querySelector('img');
                    if (icon) icon.style.filter = iconStyles[group]?.default;
                }
            }}
            onClick={onClick}
        >
            <img
                src={iconUrl}
                alt={text}
                style={{
                    filter: iconStyles[group]?.default,
                    borderRadius: '50%',
                    height: '40px',
                    width: '40px',
                    padding: '8px',
                    border: noBorder ? 'none' : '1px solid #ccc',
                    transition: 'filter 0.3s',
                }}
            />
            {isOpen && (
                <span className="text-sm font-medium" style={textStyle}>
                    {text}
                </span>
            )}
        </button>
    );
};

export default Navbar;