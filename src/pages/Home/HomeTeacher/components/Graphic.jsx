import React, { useState } from "react";
import Chart from "react-apexcharts";
import Dropdown from "./Dropdown";
import { useTranslation } from "react-i18next";

const Graphic = ({ chartData }) => {
  const { t } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState(t("HomeTeacher.Graphic.all_groups"));

  const months = [
    t("HomeTeacher.Graphic.months.0"),
    t("HomeTeacher.Graphic.months.1"),
    t("HomeTeacher.Graphic.months.2"),
    t("HomeTeacher.Graphic.months.3"),
    t("HomeTeacher.Graphic.months.4"),
    t("HomeTeacher.Graphic.months.5"),
    t("HomeTeacher.Graphic.months.6"),
    t("HomeTeacher.Graphic.months.7"),
    t("HomeTeacher.Graphic.months.8"),
    t("HomeTeacher.Graphic.months.9"),
    t("HomeTeacher.Graphic.months.10"),
    t("HomeTeacher.Graphic.months.11"),
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const lastSixMonths = [];
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.unshift(months[monthIndex]);
  }

  const groups = [t("HomeTeacher.Graphic.all_groups"), ...new Set(chartData.map((item) => item.group))];

  const filteredData =
    selectedGroup === t("HomeTeacher.Graphic.all_groups")
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
      min: 0,
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
                        <strong>${month} (${t(`HomeTeacher.Graphic.types.${type}`)}):</strong><br/>
                        ${t("HomeTeacher.Graphic.grades")}: ${grades.length > 0 ? grades.join(", ") : t("HomeTeacher.Graphic.no_data")}<br/>
                        ${t("HomeTeacher.Graphic.average")}: ${average || t("HomeTeacher.Graphic.no_data")}
                    </div>
                `;
      },
    },
  };

  const series = [
    { name: t("HomeTeacher.Graphic.homework"), data: homeworkData },
    { name: t("HomeTeacher.Graphic.classwork"), data: classworkData },
    { name: t("HomeTeacher.Graphic.test"), data: testData },
  ];

  return (
    <div className="relative bg-white w-[100%] h-[350px] flex flex-col rounded-[20px] shadow-md justify-between students-success">
      <div className="flex justify-between items-center px-4 pt-4">
        <div
          className="text-[#120c38] font-bold font-['Nunito']"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            lineHeight: "1.2",
          }}
        >
          {t("HomeTeacher.Graphic.title")}
        </div>
        <div className="w-[15vw] mobile-dropdown-teacher">
          <Dropdown
            textAll={t("HomeTeacher.Graphic.all_groups")}
            options={groups.filter((group) => group !== t("HomeTeacher.Graphic.all_groups"))}
            onSelect={(group) => setSelectedGroup(group)}
          />
        </div>
      </div>
      <div className="w-[90%] h-[80%] relative mx-auto">
        {chartData && chartData.length > 0 ? (
          <Chart options={options} series={series} type="bar" height="100%" width="100%" />
        ) : (
          <div
            className="text-[#120c38] text-center mt-10"
            style={{ fontFamily: "Mulish", fontSize: "15pt" }}
          >
            {t("HomeTeacher.Graphic.no_data")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Graphic;