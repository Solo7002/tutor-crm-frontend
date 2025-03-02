import React from "react";
import Chart from "react-apexcharts";

const Graphic = ({ chartData }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    const months = [
        "січень",
        "лютий",
        "березень",
        "квітень",
        "травень",
        "червень",
        "липень",
        "серпень",
        "вересень",
        "жовтень",
        "листопад",
        "грудень",
    ];

    const lastSixMonths = [];
    for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        lastSixMonths.unshift(months[monthIndex]);
    }

    const homeworkData = Array(6).fill(null).map((_, index) => {
        const dataPoint = chartData.find(
            (item) =>
                item.type === "Homework" &&
                months.indexOf(lastSixMonths[index]) === new Date(item.date).getMonth()
        );
        return dataPoint ? dataPoint.grade : null;
    });

    const classworkData = Array(6).fill(null).map((_, index) => {
        const dataPoint = chartData.find(
            (item) =>
                item.type === "Classwork" &&
                months.indexOf(lastSixMonths[index]) === new Date(item.date).getMonth()
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
            curve: 'smooth',
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
            min: 6,
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
                formatter: (val) => `Оцінка: ${val}`,
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
            offsetY: 5,
            fontSize: '15pt',
            fontFamily: 'Mulish',
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
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-full relative graphic">
            {/* Header */}
            <h2
                className="text-[#120c38] text-2xl font-bold font-['Nunito'] absolute top-[18px] left-[40px]"
                style={{ marginTop: 0 }}
            >
                Успішність
            </h2>

            {/* Graphic */}
            <Chart
                className="chart"
                options={options}
                series={[
                    {
                        name: "– Домашня робота",
                        data: homeworkData,
                    },
                    {
                        name: "– Робота в класі",
                        data: classworkData,
                    },
                ]}
                type="line"
                width="100%"
                height="280"
            />
        </div>
    );
};

export default Graphic;