import { useState } from "react";
import  "./HometaskDoneItemDownload.css"
const HometaskDoneItemDownload=({text,fileLink})=> {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="HometaskDoneItemDownload">
            <div className="file-item">
                <div data-svg-wrapper>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="file-icon"
                    >
                        <path
                            d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19"
                            stroke="#827FAE"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
                            stroke="#827FAE"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div className="file-name">{text}</div>
                <a
                    className="download-btn"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                   href={fileLink} target="_blank" rel="noopener noreferrer"
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 25.5V27.5C12 28.0304 12.2107 28.5391 12.5858 28.9142C12.9609 29.2893 13.4696 29.5 14 29.5H26C26.5304 29.5 27.0391 29.2893 27.4142 28.9142C27.7893 28.5391 28 28.0304 28 27.5V25.5M15 19.5L20 24.5M20 24.5L25 19.5M20 24.5V12.5"
                            stroke={isHovered ? "black" : "#47C974"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default HometaskDoneItemDownload;