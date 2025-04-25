import { useTranslation } from "react-i18next";
import "./Panel.css";

const Panel = () => {
  const { t } = useTranslation();

  return (
    <div className="panel-container">
      {/* Контент */}
      <div className="panel-content">
        {/* Текстова частина */}
        <div className="panel-text">
          <h2 className="panel-title">{t("CalendarTeacher.components.Panel.UI.Title")}</h2>
          <p className="panel-subtitle">{t("CalendarTeacher.components.Panel.UI.Subtitle")}</p>
        </div>

        {/* Кнопка */}
        <div className="panel-button-wrapper">
          <button className="panel-button">
            {t("CalendarTeacher.components.Panel.UI.ButtonText")}
            <span className="soon-label">{t("CalendarTeacher.components.Panel.UI.SoonLabel")}</span>
          </button>
        </div>
      </div>

      {/* Декоративні елементи зліва */}
      <div className="panel-decor-left">
        <svg
          className="panel-svg-left"
          viewBox="0 0 281 197"
          fill="none"
          preserveAspectRatio="xMinYMin meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M234.495 62.1309C252.495 42.5309 251.329 12.6309 248.495 0.130859H280.495C280.495 29.2975 269.595 87.8309 225.995 88.6309C171.495 89.6309 174.495 47.1309 174.495 42.1309C174.495 37.1309 183.995 31.1309 183.995 45.1309C183.995 59.1309 211.995 86.6309 234.495 62.1309Z"
            fill="#8A48E6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M250.089 12.8815C250.761 27.4801 248.034 47.9463 234.548 62.6309C212.048 87.1309 184.048 59.6309 184.048 45.6309C184.048 40.17 182.603 37.7521 180.839 37.1309H180.048C179.381 50.7975 184.748 78.4309 211.548 79.6309C245.048 81.1309 258.548 37.1309 250.548 10.6309C250.404 11.3032 250.252 12.0566 250.089 12.8815Z"
            fill="#AB85E5"
          />
          <path
            d="M49.9948 0C15.1948 109.6 130.495 177.5 192.495 197H112.495C14.8951 159 -8.50575 63.5005 2.49463 0.000359535C3.99472 0.000424027 8.49475 0 49.9948 0Z"
            fill="#8A48E6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.474 0.291016C20.4845 34.4375 18.6336 111.104 72.2154 144.372C124.572 176.879 180.071 202.648 196.759 201.636C196.149 200.682 195.469 199.724 194.737 198.775L190.977 195.63C128.632 175.516 15.5668 109.327 50.0345 0.669986L50.0251 0.629441C41.8087 0.469938 35.0472 0.360834 29.474 0.291016Z"
            fill="#AB85E5"
          />
          <ellipse
            cx="35.9955"
            cy="60.6305"
            rx="4"
            ry="9"
            transform="rotate(-7.14 35.9955 60.6305)"
            fill="#8A48E6"
          />
          <ellipse
            cx="57.0828"
            cy="115.058"
            rx="4"
            ry="9"
            transform="rotate(-25.14 57.0828 115.058)"
            fill="#8A48E6"
          />
          <ellipse
            cx="107.439"
            cy="157.477"
            rx="4"
            ry="9"
            transform="rotate(-54.89 107.439 157.477)"
            fill="#8A48E6"
          />
          <ellipse
            cx="37.9949"
            cy="9.6299"
            rx="4"
            ry="9"
            transform="rotate(11.86 37.9949 9.6299)"
            fill="#8A48E6"
          />
        </svg>
      </div>

      {/* Декоративні елементи справа */}
      <div className="panel-decor-right">
        <svg
          className="panel-svg-right"
          viewBox="0 0 281 197"
          fill="none"
          preserveAspectRatio="xMaxYMax meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M45.9998 62.1309C27.9998 42.5309 29.1665 12.6309 31.9998 0.130859H0C-6.86646e-05 29.2975 10.8998 87.8309 54.4998 88.6309C109 89.6309 106 47.1309 106 42.1309C106 37.1309 96.4998 31.1309 96.4998 45.1309C96.4998 59.1309 68.4998 86.6309 45.9998 62.1309Z"
            fill="#8A48E6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.4059 12.8815C29.734 27.4801 32.4612 47.9463 45.9471 62.6309C68.4471 87.1309 96.4471 59.6309 96.4471 45.6309C96.4471 40.17 97.8925 37.7521 99.6557 37.1309H100.447C101.114 50.7975 95.7471 78.4309 68.9471 79.6309C35.4471 81.1309 21.9473 37.1309 29.9473 10.6309C30.0913 11.3032 30.2436 12.0566 30.4059 12.8815Z"
            fill="#AB85E5"
          />
          <path
            d="M230.5 0C265.3 109.6 150 177.5 88 197H168C265.6 159 289.001 63.5005 278 0.000359535C276.5 0.000424027 272 0 230.5 0Z"
            fill="#8A48E6"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M251.021 0.291016C260.011 34.4375 261.862 111.104 208.28 144.372C155.923 176.879 100.424 202.648 83.7364 201.636C84.3465 200.682 85.0263 199.724 85.7581 198.775L89.5184 195.63C151.863 175.516 264.928 109.327 230.461 0.669986L230.47 0.629441C238.686 0.469938 245.448 0.360834 251.021 0.291016Z"
            fill="#AB85E5"
          />
          <ellipse
            cx="4"
            cy="9"
            rx="4"
            ry="9"
            transform="matrix(-0.99225 -0.124258 -0.124258 0.99225 249.587 52.1973)"
            fill="#8A48E6"
          />
          <ellipse
            cx="4"
            cy="9"
            rx="4"
            ry="9"
            transform="matrix(-0.905303 -0.424766 -0.424766 0.905303 230.856 108.609)"
            fill="#8A48E6"
          />
          <ellipse
            cx="4"
            cy="9"
            rx="4"
            ry="9"
            transform="matrix(-0.575174 -0.818031 -0.818031 0.575174 182.719 155.572)"
            fill="#8A48E6"
          />
          <ellipse
            cx="4"
            cy="9"
            rx="4"
            ry="9"
            transform="matrix(-0.978658 0.205494 0.205494 0.978658 244.565 0)"
            fill="#8A48E6"
          />
        </svg>
      </div>
    </div>
  );
};

export default Panel;