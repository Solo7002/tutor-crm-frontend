import React, { useState } from "react";
import Chart from "react-apexcharts";

const Graphic = ({ chartData }) => {
  const [selectedGroup, setSelectedGroup] = useState("Усі групи");

  const months = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const lastSixMonths = [];
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.unshift(months[monthIndex]);
  }

  const groups = ["Усі групи", ...new Set(chartData.map((item) => item.group))];

  const filteredData =
    selectedGroup === "Усі групи"
      ? chartData
      : chartData.filter((item) => item.group === selectedGroup);

  const calculateAverage = (type, month) => {
    const grades = filteredData
      .filter(
        (item) =>
          item.type === type && months[new Date(item.date).getMonth()] === month
      )
      .map((item) => item.grade);
    return grades.length > 0
      ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10
      : null;
  };

  const homeworkData = lastSixMonths.map((month) =>
    calculateAverage("Homework", month)
  );
  const classworkData = lastSixMonths.map((month) =>
    calculateAverage("Classwork", month)
  );
  const testData = lastSixMonths.map((month) => calculateAverage("Test", month));

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: lastSixMonths,
      labels: {
        style: {
          colors: "#120C38",
          fontSize: "15px",
          fontFamily: "Mulish",
        },
      },
      axisBorder: {
          show: true,
          color: "#120C38",
      },
    },
    yaxis: {
      min: 6,
      max: 12,
      tickAmount: 6,
      labels: {
        style: {
          colors: "#120C38",
          fontSize: "15px",
          fontFamily: "Mulish",
        },
      },
      axisBorder: {
          show: true,
          color: "#120C38",
      },
    },
    colors: ["#C3A2F2", "#88F2FF", "#827EAD"],
    grid: {
      borderColor: "#E0C8FF",
      strokeDashArray: 0,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -45,
      fontSize: "12px",
      fontFamily: "Mulish",
      fontWeight: 400,
      labels: { colors: "#120C38" },
      markers: {
        width: 11,
        height: 11,
        radius: 50,
      },
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex }) => {
        const month = lastSixMonths[dataPointIndex];
        const type =
          seriesIndex === 0
            ? "Homework"
            : seriesIndex === 1
            ? "Classwork"
            : "Test";
        const grades = filteredData
          .filter(
            (item) =>
              item.type === type &&
              months[new Date(item.date).getMonth()] === month
          )
          .map((item) => item.grade);
        const average = calculateAverage(type, month);

        return `
          <div style="padding: 10px; background: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <strong>${month} (${type}):</strong><br/>
            Оцінки: ${grades.length > 0 ? grades.join(", ") : "Немає даних"}<br/>
            Середня: ${average || "Немає даних"}
          </div>
        `;
      },
    },
  };

  const series = [
    { name: "-Домашня робота", data: homeworkData },
    { name: "-Робота в класі", data: classworkData },
    { name: "-Тести", data: testData },
  ];

  return (
    <div className="relative bg-white w-[100%] h-[33vh] flex flex-col rounded-lg shadow-md justify-between border border-[#8a48e6] students-success">
      <div className="flex justify-between items-center px-4 pt-4">
        <div
          className="text-[#120c38] font-bold font-['Nunito']"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            lineHeight: "1.2",
          }}
        >
          Успішність учнів
        </div>
        <div className="w-[116px] h-10 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex-col justify-center items-start gap-1.5 inline-flex">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full h-6 text-[#827ead] text-[15px] font-bold font-['Nunito'] bg-transparent border-none"
          >
            {groups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-[90%] h-[80%] relative mx-auto">
        <Chart options={options} series={series} type="bar" height="100%" width="100%" />
      </div>
    </div>
  );
};

export default Graphic;