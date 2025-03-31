import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFooterItem, setActiveFooterItem] = useState(null);
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [imageUrl, setImageUrl] = useState("../../../assets/images/avatar.jpg");
  const [userRole, setUserRole] = useState("Student");
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Ошибка при расшифровке токена:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:4000/api/users/${userId}/balance`)
        .then((response) => {
          const { Role, Username, Balance } = response.data;
          setUserRole(Role);
          setUserName(Username);

          if (Role === "Student") {
            setBalance(Balance.Trophies);
          } else if (Role === "Teacher") {
            setBalance(Balance.OctoCoins);
          }

          return axios.get(`http://localhost:4000/api/users/${userId}`);
        })
        .then((userResponse) => {
          const { ImageFilePath, FirstName, LastName } = userResponse.data;
          setImageUrl(ImageFilePath || "../../../assets/images/avatar.jpg");
          setUserName(`${FirstName} ${LastName}`);
        })
        .catch((error) => {
          console.error("Ошибка при получении данных пользователя или баланса:", error);
        });
    }
  }, [userId]);

  const getDefaultActiveNavItem = () => {
    if (userRole === "Student") {
      switch (location.pathname) {
        case "/student/home":
          return "home";
        case "/student/hometask":
          return "task";
        case "/student/tests":
          return "test";
        case "/student/calendar":
          return "calendar";
        case "/student/materials":
          return "library";
        case "/student/reviews":
          return "review";
        case "/student/search":
          return "search";
        case "/student/info":
          return "info";
        case "/student/settings":
          return "settings";
        default:
          return "profile";
      }
    } else if (userRole === "Teacher") {
      switch (location.pathname) {
        case "/teacher/home":
          return "home";
        case "/teacher/hometask":
          return "hometask";
        case "/teacher/tests":
          return "test";
        case "/teacher/calendar":
          return "calendar";
        case "/teacher/materials":
          return "library";
        case "/teacher/reviews":
          return "review";
        case "/teacher/info":
          return "info";
        case "/teacher/settings":
          return "settings";
        default:
          return "profile";
      }
    }
  };

  const [activeNavItem, setActiveNavItem] = useState(getDefaultActiveNavItem());

  // const handleNavItemClick = (navItem, label) => {
  //   setActiveNavItem(navItem);
  //   setCurrentPageTitle(label);
  //   if (isSidebarOpen) setIsSidebarOpen(false);
  // };

  const NavItem = ({ icon, text, to, isActive, onClick, noBorder, blackText, group, fontSize }) => {
    const baseButtonStyle = {
      backgroundColor: isActive ? "#8A48E6" : "white",
      height: "40px",
      display: "flex",
      alignItems: "center",
      width: isSidebarOpen ? "228px" : "40px",
      justifyContent: isSidebarOpen ? "flex-start" : "center",
      border: noBorder ? "none" : "1px solid #D7D7D7",
      transition: "background-color 0.3s, color 0.3s, border 0.3s",
      borderRadius: "9999px",
      cursor: "pointer",
      position: "relative",
      marginBottom: "20px",
      marginLeft: "7px",
    };

    const textStyles = {
      menu: {
        default: { color: "#120C38" },
        hover: { color: "#120C38" },
      },
      main: {
        default: { color: isActive ? "white" : "#827FAE" },
        hover: { color: isActive ? "white" : "#120C38" },
      },
      footer: {
        default: { color: isActive ? "white" : "#120C38" },
        hover: { color: "white" },
      },
    };

    const hoverBackground = {
      menu: "#8A48E6",
      main: isActive ? "#8A48E6" : "#E5E7EB",
      footer: "#A768FF",
    };

    const getStrokeColor = () => {
      if (group === "footer") {
        return isActive ? "white" : "#120C38";
      }
      return isActive ? "white" : "#827FAE";
    };

    const updatedIcon = React.cloneElement(icon, {
      children: React.Children.map(icon.props.children, (child) => {
        if (child.type === "path") {
          return React.cloneElement(child, {
            stroke: getStrokeColor(),
          });
        }
        return child;
      }),
    });

    return (
      <Link
        className="navlink"
        to={to}
        style={baseButtonStyle}
        onMouseEnter={(e) => {
          if (group === "main") {
            e.currentTarget.style.backgroundColor = hoverBackground[group];
            e.currentTarget.style.border = noBorder ? "none" : "1px solid white";

            const svgDiv = e.currentTarget.querySelector("div");
            const svgPaths = e.currentTarget.querySelectorAll("path");
            if (svgPaths) {
              svgDiv.style.border = noBorder ? "none" : '1px solid white';
              svgPaths.forEach((path) => {
                path.setAttribute("stroke", isActive ? "white" : "#120C38");
              });
            }

            const textElement = e.currentTarget.querySelector(".nav-item-text");
            if (textElement) textElement.style.color = textStyles[group]?.hover?.color;
          }
          else if (group === "footer") {
            e.currentTarget.style.backgroundColor = hoverBackground[group];
            e.currentTarget.style.border = noBorder ? "none" : "1px solid #D7D7D7";

            const svgDiv = e.currentTarget.querySelector("div");
            const svgPaths = e.currentTarget.querySelectorAll("path");
            if (svgPaths) {
              svgDiv.style.border = noBorder ? "none" : "1px solid #D7D7D7";
              svgPaths.forEach((path) => {
                path.setAttribute("stroke", isActive ? "white" : "white");
              });
            }

            const textElement = e.currentTarget.querySelector(".nav-item-text");
            if (textElement) textElement.style.color = textStyles[group]?.hover?.color;
          }
        }}
        onMouseLeave={(e) => {
          if (group === "main") {
            e.currentTarget.style.backgroundColor = isActive ? "#8A48E6" : "white";
            e.currentTarget.style.border = noBorder ? "none" : "1px solid #D7D7D7";

            const svgDiv = e.currentTarget.querySelector("div");
            const svgPaths = e.currentTarget.querySelectorAll("path");
            if (svgPaths) {
              svgDiv.style.border = noBorder ? "none" : '1px solid #D7D7D7';
              svgPaths.forEach((path) => {
                path.setAttribute("stroke", isActive ? "white" : "#827FAE");
              });
            }

            const textElement = e.currentTarget.querySelector(".nav-item-text");
            if (textElement) textElement.style.color = textStyles[group]?.default?.color;
          }
          else if (group === "footer") {
            e.currentTarget.style.backgroundColor = isActive ? "#8A48E6" : "white";
            e.currentTarget.style.border = noBorder ? "none" : "1px solid #D7D7D7";

            const svgDiv = e.currentTarget.querySelector("div");
            const svgPaths = e.currentTarget.querySelectorAll("path");
            if (svgPaths) {
              svgDiv.style.border = noBorder ? "none" : "1px solid #D7D7D7";
              svgPaths.forEach((path) => {
                path.setAttribute("stroke", isActive ? "white" : "#120C38");
              });
            }

            const textElement = e.currentTarget.querySelector(".nav-item-text");
            if (textElement) textElement.style.color = textStyles[group]?.default?.color;
          }
        }}
        onClick={() => {
          onClick();
        }}
      >
        {/* Icon */}
        <div
          className="nav-icon"
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: noBorder ? "none" : "1px solid #ccc",
            borderRadius: "50%"
          }}
        >
          {updatedIcon}
        </div>

        {/* Text */}
        {isSidebarOpen && (
          <span
            className="nav-item-text"
            style={{
              marginLeft: "12px",
              fontSize: fontSize || "15px",
              fontFamily: "Nunito",
              fontWeight: "700",
              color: textStyles[group]?.default?.color,
            }}
          >
            {text}
          </span>
        )}
      </Link>
    );
  };

  const handleFooterItemClick = (itemKey) => {
    setActiveFooterItem(itemKey);
  };
  const getNavLinks = () => {
    if (userRole === "Student") {
      return [
        {
          path: "/student/home",
          label: "Головна",
          key: "home",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H3L12 3L21 12H19M5 12V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V12" stroke="#827FAE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21V15C9 14.4696 9.21071 13.9609 9.58579 13.5858C9.96086 13.2107 10.4696 13 11 13H13C13.5304 13 14.0391 13.2107 14.4142 13.5858C14.7893 13.9609 15 14.4696 15 15V21" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        },
        {
          path: "/student/hometask", label: "Домашні завдання", key: "task", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4V22M13 8H15M13 12H15M6 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/student/tests", label: "Тести", key: "test", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 6H20M11 12H20M12 18H20M4 16C4 15.4696 4.21071 14.9609 4.58579 14.5858C4.96086 14.2107 5.46957 14 6 14C6.53043 14 7.03914 14.2107 7.41421 14.5858C7.78929 14.9609 8 15.4696 8 16C8 16.591 7.5 17 7 17.5L4 20H8M6 10V4L4 6" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/student/calendar", label: "Календар", key: "calendar", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/student/materials", label: "Матеріали", key: "library", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 18.9997C10.6318 18.2098 9.07983 17.7939 7.5 17.7939C5.92017 17.7939 4.36817 18.2098 3 18.9997V5.99972C4.36817 5.2098 5.92017 4.79395 7.5 4.79395C9.07983 4.79395 10.6318 5.2098 12 5.99972M12 18.9997C13.3682 18.2098 14.9202 17.7939 16.5 17.7939C18.0798 17.7939 19.6318 18.2098 21 18.9997V5.99972C19.6318 5.2098 18.0798 4.79395 16.5 4.79395C14.9202 4.79395 13.3682 5.2098 12 5.99972M12 18.9997V5.99972" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/student/reviews", label: "Відгуки", key: "review", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 9H9.51M14.5 9H14.51M18 4C18.7956 4 19.5587 4.31607 20.1213 4.87868C20.6839 5.44129 21 6.20435 21 7V15C21 15.7956 20.6839 16.5587 20.1213 17.1213C19.5587 17.6839 18.7956 18 18 18H13L8 21V18H6C5.20435 18 4.44129 17.6839 3.87868 17.1213C3.31607 16.5587 3 15.7956 3 15V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H18Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.5 13C9.82588 13.3326 10.2148 13.5968 10.6441 13.7772C11.0734 13.9576 11.5344 14.0505 12 14.0505C12.4656 14.0505 12.9266 13.9576 13.3559 13.7772C13.7852 13.5968 14.1741 13.3326 14.5 13" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/student/search", label: "Пошук", key: "search", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C8.1705 16.8189 9.08075 17 10 17C10.9193 17 11.8295 16.8189 12.6788 16.4672C13.5281 16.1154 14.2997 15.5998 14.9497 14.9497C15.5998 14.2997 16.1154 13.5281 16.4672 12.6788C16.8189 11.8295 17 10.9193 17 10C17 9.08075 16.8189 8.1705 16.4672 7.32122C16.1154 6.47194 15.5998 5.70026 14.9497 5.05025C14.2997 4.40024 13.5281 3.88463 12.6788 3.53284C11.8295 3.18106 10.9193 3 10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
      ];
    } else if (userRole === "Teacher") {
      return [
        {
          path: "/teacher/home",
          label: "Головна",
          key: "home",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H3L12 3L21 12H19M5 12V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21V15C9 14.4696 9.21071 13.9609 9.58579 13.5858C9.96086 13.2107 10.4696 13 11 13H13C13.5304 13 14.0391 13.2107 14.4142 13.5858C14.7893 13.9609 15 14.4696 15 15V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        },
        {
          path: "/teacher/hometasks", label: "Завдання", key: "task", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4V22M13 8H15M13 12H15M6 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/teacher/tests", label: "Тести", key: "test", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 6H20M11 12H20M12 18H20M4 16C4 15.4696 4.21071 14.9609 4.58579 14.5858C4.96086 14.2107 5.46957 14 6 14C6.53043 14 7.03914 14.2107 7.41421 14.5858C7.78929 14.9609 8 15.4696 8 16C8 16.591 7.5 17 7 17.5L4 20H8M6 10V4L4 6" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/teacher/calendar", label: "Календар", key: "calendar", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/teacher/materials", label: "Матеріали", key: "library", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 18.9997C10.6318 18.2098 9.07983 17.7939 7.5 17.7939C5.92017 17.7939 4.36817 18.2098 3 18.9997V5.99972C4.36817 5.2098 5.92017 4.79395 7.5 4.79395C9.07983 4.79395 10.6318 5.2098 12 5.99972M12 18.9997C13.3682 18.2098 14.9202 17.7939 16.5 17.7939C18.0798 17.7939 19.6318 18.2098 21 18.9997V5.99972C19.6318 5.2098 18.0798 4.79395 16.5 4.79395C14.9202 4.79395 13.3682 5.2098 12 5.99972M12 18.9997V5.99972" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/teacher/reviews", label: "Відгуки", key: "review", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 9H9.51M14.5 9H14.51M18 4C18.7956 4 19.5587 4.31607 20.1213 4.87868C20.6839 5.44129 21 6.20435 21 7V15C21 15.7956 20.6839 16.5587 20.1213 17.1213C19.5587 17.6839 18.7956 18 18 18H13L8 21V18H6C5.20435 18 4.44129 17.6839 3.87868 17.1213C3.31607 16.5587 3 15.7956 3 15V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H18Z" stroke="#827FAE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.5 13C9.82588 13.3326 10.2148 13.5968 10.6441 13.7772C11.0734 13.9576 11.5344 14.0505 12 14.0505C12.4656 14.0505 12.9266 13.9576 13.3559 13.7772C13.7852 13.5968 14.1741 13.3326 14.5 13" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
      ];
    }
  };

  const navLinks = getNavLinks();

  const getSettingsAndInfoLinks = () => {
    if (userRole === "Student") {
      return [
        {
          path: "/student/settings", label: "Налаштування", key: "settings", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
        {
          path: "/student/info", label: "Інформація", key: "info", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },

      ];
    } else if (userRole === "Teacher") {
      return [


        {
          path: "/teacher/settings", label: "Налаштування", key: "settings", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        }, {
          path: "/teacher/info", label: "Інформація", key: "info", icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          )
        },
      ];
    }
  };

  const settingsAndInfoLinks = getSettingsAndInfoLinks();

  const getDefaultPageTitle = () => {
    const navLinks = getNavLinks();
    const settingsAndInfoLinks = getSettingsAndInfoLinks();
    const allLinks = [...navLinks, ...settingsAndInfoLinks];

    const currentLink = allLinks.find((link) =>
      location.pathname.startsWith(link.path)
    );

    return currentLink?.label || "Профіль";
  };

  const [currentPageTitle, setCurrentPageTitle] = useState(getDefaultPageTitle());
  useEffect(() => {
    const newActiveItem = getDefaultActiveNavItem();
    setActiveNavItem(newActiveItem);
    setCurrentPageTitle(getDefaultPageTitle());
  }, [location.pathname, userRole]);

  const handleNavItemClick = (navItem, label) => {
    setActiveNavItem(navItem);
    setCurrentPageTitle(label);
    if (isSidebarOpen) setIsSidebarOpen(false);
  };
  return (
    <div className="flex h-screen w-[100%] navbar">
      {/* Sidebar */}
      <div
        className={`sidebar h-screen fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 w-24 ${isSidebarOpen ? "w-[274px]" : ""
          } ${isSidebarOpen ? "sidebar-visible" : ""} flex flex-col z-50`}
      >
        <div className="pl-5 pt-5 menu">
          <NavItem
            icon={(<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 22.5C4.64584 22.5 4.34917 22.38 4.11 22.14C3.87084 21.9 3.75084 21.6033 3.75 21.25C3.74917 20.8967 3.86917 20.6 4.11 20.36C4.35084 20.12 4.6475 20 5 20H25C25.3542 20 25.6513 20.12 25.8913 20.36C26.1313 20.6 26.2508 20.8967 26.25 21.25C26.2492 21.6033 26.1292 21.9004 25.89 22.1413C25.6508 22.3821 25.3542 22.5017 25 22.5H5ZM5 16.25C4.64584 16.25 4.34917 16.13 4.11 15.89C3.87084 15.65 3.75084 15.3533 3.75 15C3.74917 14.6467 3.86917 14.35 4.11 14.11C4.35084 13.87 4.6475 13.75 5 13.75H25C25.3542 13.75 25.6513 13.87 25.8913 14.11C26.1313 14.35 26.2508 14.6467 26.25 15C26.2492 15.3533 26.1292 15.6504 25.89 15.8913C25.6508 16.1321 25.3542 16.2517 25 16.25H5ZM5 10C4.64584 10 4.34917 9.88 4.11 9.64C3.87084 9.4 3.75084 9.10333 3.75 8.75C3.74917 8.39667 3.86917 8.1 4.11 7.86C4.35084 7.62 4.6475 7.5 5 7.5H25C25.3542 7.5 25.6513 7.62 25.8913 7.86C26.1313 8.1 26.2508 8.39667 26.25 8.75C26.2492 9.10333 26.1292 9.40042 25.89 9.64125C25.6508 9.88208 25.3542 10.0017 25 10H5Z" fill="#120C38" />
            </svg>
            )}
            text="Меню"
            isOpen={isSidebarOpen}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            noBorder
            blackText
            group="menu"
            fontSize="24px"
          />
        </div>
        {/* Profile Section */}

        <Link to={userRole === "Student" ? "/student/profile" : "/teacher/profile"}>
          <div
            className="profile"
            style={{
              width: "60px",
              height: "60px",
              position: "absolute",
              left: "20px",
              top: "80px",
              borderRadius: "50%",
              border: "1px solid #ccc",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => handleNavItemClick("profile", "Профіль")}
          >
            <img
              src={imageUrl}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {isSidebarOpen && (
            <div
              className="profile-name"
              style={{
                position: "absolute",
                left: "100px",
                top: "80px",
                color: "#120C38",
                fontFamily: "Nunito",
                fontWeight: "700",
              }}
            >
              {userName}
              {/* {userRole === "Student" ? "Ім’я студента" : "Ім’я вчителя"} */}
              <div
                style={{
                  fontSize: "12px",
                  color: "#827FAE",
                  marginTop: "5px",
                }}
              >
                Баланс: {balance}
              </div>
            </div>
          )}</Link>

        {/* Navigation Items */}
        <div className="navitems" style={{ marginTop: "80px", padding: "20px", flex: 1 }}>
          {navLinks.map((link) => (
            <NavItem
              key={link.key}
              icon={link.icon}
              text={link.label}
              to={link.path}
              isActive={activeNavItem === link.key}
              onClick={() => {
                handleNavItemClick(link.key, link.label);
              }}
              group="main"
            />
          ))}
        </div>

        {/* Settings and Info Container */}
        <div className="footer p-5 flex flex-col-reverse justify-end space-y-4">
          {settingsAndInfoLinks.map((link) => (
            <NavItem
              key={link.key}
              icon={link.icon}
              text={link.label}
              to={link.path}
              isActive={activeNavItem === link.key}
              onClick={() => {
                handleNavItemClick(link.key);
              }}
              group="footer"
              noBorder
              blackText
            />
          ))}
          <Link to="/">
            <button
              className="rounded-full border border-gray-300 transition-all duration-300 hidden"
              onMouseEnter={(e) => {
                const svgPaths = e.currentTarget.querySelectorAll("path");
                if (svgPaths) {
                  svgPaths.forEach((path) => {
                    path.setAttribute("stroke", "white");
                  });
                }
              }
              }
              onMouseLeave={(e) => {
                const svgPaths = e.currentTarget.querySelectorAll("path");
                if (svgPaths) {
                  svgPaths.forEach((path) => {
                    path.setAttribute("stroke", "#120C38");
                  });
                }
              }
              }
              onClick={handleFooterItemClick}
            >
              <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                {<svg className="stroke-[#120C38] transition-colors duration-300 " width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 17V18C9 18.7956 9.31607 19.5587 9.87868 20.1213C10.4413 20.6839 11.2044 21 12 21C12.7956 21 13.5587 20.6839 14.1213 20.1213C14.6839 19.5587 15 18.7956 15 18V17M10 5C10 4.46957 10.2107 3.96086 10.5858 3.58579C10.9609 3.21071 11.4696 3 12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5C15.1484 5.54303 16.1274 6.38833 16.8321 7.4453C17.5367 8.50227 17.9404 9.73107 18 11V14C18.0753 14.6217 18.2954 15.2171 18.6428 15.7381C18.9902 16.2592 19.4551 16.6914 20 17H4C4.54494 16.6914 5.00981 16.2592 5.35719 15.7381C5.70457 15.2171 5.92474 14.6217 6 14V11C6.05956 9.73107 6.4633 8.50227 7.16795 7.4453C7.8726 6.38833 8.85159 5.54303 10 5Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                }
              </div>
            </button>
          </Link>
          <Link to="/">
            <button
              className="rounded-full border border-gray-300 transition-all duration-300 hidden"
              onClick={handleFooterItemClick}
            >
              <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 12V12.01M3 21H21M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14.5M17 13.5V21M14 7H21M21 7L18 4M21 7L18 10" stroke="#E64851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                }
              </div>
            </button>
          </Link>
        </div>
      </div>

      {/* Top Navbar */}
      <div className="nav-center flex-1 flex flex-col pl-24 w-[100%]">
        <header className="h-20 flex items-center justify-between bg-white shadow-md px-4 "
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 49,
          }}
        >
          <span
            className="text-lg font-semibold pl-[110px]"
            style={{ fontSize: '32px', fontFamily: 'Nunito', fontWeight: '700', color: '#120C38' }}
          >
            {/* Головна */}
            {currentPageTitle}
          </span>
          <div className="flex space-x-8">
            <Link to="/">
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-[#A768FF] transition-all duration-300"
                onMouseEnter={(e) => {
                  const svgPaths = e.currentTarget.querySelectorAll("path");
                  if (svgPaths) {
                    svgPaths.forEach((path) => {
                      path.setAttribute("stroke", "white");
                    });
                  }
                }
                }
                onMouseLeave={(e) => {
                  const svgPaths = e.currentTarget.querySelectorAll("path");
                  if (svgPaths) {
                    svgPaths.forEach((path) => {
                      path.setAttribute("stroke", "#120C38");
                    });
                  }
                }
                }
              >
                <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg
                    className="stroke-[#120C38] hover:stroke-white transition-colors duration-300"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 5H11M9 3V5C9 9.418 6.761 13 4 13"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 9C5 11.144 7.952 12.908 11.7 13M12 20L16 11L20 20M19.1 18H12.9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </Link>
            <Link to="/">
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-[#A768FF] transition-all duration-300"
                onMouseEnter={(e) => {
                  const svgPaths = e.currentTarget.querySelectorAll("path");
                  if (svgPaths) {
                    svgPaths.forEach((path) => {
                      path.setAttribute("stroke", "white");
                    });
                  }
                }
                }
                onMouseLeave={(e) => {
                  const svgPaths = e.currentTarget.querySelectorAll("path");
                  if (svgPaths) {
                    svgPaths.forEach((path) => {
                      path.setAttribute("stroke", "#120C38");
                    });
                  }
                }
                }
              >
                <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {<svg
                    className="stroke-[#120C38] hover:stroke-white transition-colors duration-300"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H4M12 3V4M20 12H21M12 20V21M5.6 5.6L6.3 6.3M18.4 5.6L17.7 6.3M17.7 17.7L18.4 18.4M6.3 17.7L5.6 18.4M8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  }
                </div>
              </button>
            </Link>
            <Link to="/">
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-[#A768FF] transition-all duration-300"
                onMouseEnter={(e) => {
                  const svgPaths = e.currentTarget.querySelectorAll("path");
                  if (svgPaths) {
                    svgPaths.forEach((path) => {
                      path.setAttribute("stroke", "white");
                    });
                  }
                }
                }
                onMouseLeave={(e) => {
                  const svgPaths = e.currentTarget.querySelectorAll("path");
                  if (svgPaths) {
                    svgPaths.forEach((path) => {
                      path.setAttribute("stroke", "#120C38");
                    });
                  }
                }
                }
              >
                <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {<svg className="stroke-[#120C38] hover:stroke-white transition-colors duration-300" width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17V18C9 18.7956 9.31607 19.5587 9.87868 20.1213C10.4413 20.6839 11.2044 21 12 21C12.7956 21 13.5587 20.6839 14.1213 20.1213C14.6839 19.5587 15 18.7956 15 18V17M10 5C10 4.46957 10.2107 3.96086 10.5858 3.58579C10.9609 3.21071 11.4696 3 12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5C15.1484 5.54303 16.1274 6.38833 16.8321 7.4453C17.5367 8.50227 17.9404 9.73107 18 11V14C18.0753 14.6217 18.2954 15.2171 18.6428 15.7381C18.9902 16.2592 19.4551 16.6914 20 17H4C4.54494 16.6914 5.00981 16.2592 5.35719 15.7381C5.70457 15.2171 5.92474 14.6217 6 14V11C6.05956 9.73107 6.4633 8.50227 7.16795 7.4453C7.8726 6.38833 8.85159 5.54303 10 5Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  }
                </div>
              </button>
            </Link>
            <Link to="/">
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-[#A768FF] transition-all duration-300"
              >
                <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 12V12.01M3 21H21M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14.5M17 13.5V21M14 7H21M21 7L18 4M21 7L18 10" stroke="#E64851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  }
                </div>
              </button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div
          className={`nav-content flex-1 flex flex-col ml-[50px] pr-[50px] mt-[80px] transition-all duration-300 ${isSidebarOpen ? "bg-gray-800/20 backdrop-blur-sm" : ""
            }`}
        >
          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <Outlet />
        </div>
        <div className="absolute top-[80px] right-0 w-[60px] bg-nav-pattern bg-repeat pointer-events-none" style={{ height: 'calc(100% - 80px)' }} />
      </div>
    </div>
  );
};

export default Navbar;