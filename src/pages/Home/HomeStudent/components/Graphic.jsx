import React from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

const Graphic = ({ chartData }) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const monthKeys = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const lastSixMonths = [];
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.unshift(t(`HomeStudent.Graphic.months.${monthKeys[monthIndex]}`));
  }

  const homeworkData = Array(6).fill(null).map((_, index) => {
    const dataPoint = chartData.find(
      (item) =>
        (item.type === "Homework" || item.type === "Test") &&
        monthKeys.indexOf(monthKeys[lastSixMonths.indexOf(lastSixMonths[index])]) ===
          new Date(item.date).getMonth()
    );
    return dataPoint ? dataPoint.grade : null;
  });

  const classworkData = Array(6).fill(null).map((_, index) => {
    const dataPoint = chartData.find(
      (item) =>
        item.type === "Classwork" &&
        monthKeys.indexOf(monthKeys[lastSixMonths.indexOf(lastSixMonths[index])]) ===
          new Date(item.date).getMonth()
    );
    return dataPoint ? dataPoint.grade : null;
  });

  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      line: {
        curve: "smooth",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    xaxis: {
      categories: lastSixMonths,
      labels: {
        style: {
          colors: "#120C38",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#120C38",
      },
    },
    yaxis: {
      min: 0,
      max: 12,
      tickAmount: 6,
      labels: {
        style: {
          colors: "#120C38",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#120C38",
      },
    },
    colors: ["#88F2FF", "#8A48E6"],
    grid: {
      borderColor: "#E0C8FF",
      strokeDashArray: 99999,
    },
    tooltip: {
      y: {
        formatter: (val) => `${t("HomeStudent.Graphic.gradeTooltip")} ${val}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetY: 5,
      fontSize: "12pt",
      fontFamily: "Mulish",
      fontWeight: 400,
      markers: {
        width: 20,
        height: 20,
        radius: 50,
      },
      labels: {
        colors: "#120C38",
      },
    },
  };

  return (
    <div className="flex-1 bg-white p-4 rounded-[20px] shadow-md h-[320px] relative graphic">
      <h2
        className="text-[#120c38] text-2xl font-bold font-['Nunito'] absolute top-[18px] left-[40px]"
        style={{ marginTop: 0 }}
      >
        {t("HomeStudent.Graphic.title")}
      </h2>
      <Chart
        className="chart"
        options={options}
        series={[
          {
            name: t("HomeStudent.Graphic.homework"),
            data: homeworkData,
          },
          {
            name: t("HomeStudent.Graphic.classwork"),
            data: classworkData,
          },
        ]}
        type="line"
        width="100%"
        height="300"
      />
    </div>
  );
};

export default Graphic;