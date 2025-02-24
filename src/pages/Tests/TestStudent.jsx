import React, { useState } from "react";
import SearchButton from "./components/SearchButton";
import TaskButton from "./components/TaskButton/TaskButton";
import TestCard from "./components/TestCard/TestCard"

const tests = [
    { id: 1, type: "default", score: null },
    { id: 2, type: "overdue", score: null },
    { id: 3, type: "done_good", score: "10/12" },
    { id: 4, type: "done_medium", score: "7/10" },
    { id: 5, type: "done_bad", score: "3/10" },
];


const buttons = [
    { text: 'До виконання', icon: 'M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01', count: 0 },
    { text: 'Виконано', icon: 'M5 12L10 17L20 7', count: 0 }];

const TestStudent = () => {
    const [completedView, setCompletedView] = useState(false);
    const [selectedButton, setSelectedButton] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const handleButtonClick = (index) => {
        //   getStatus(index);
        setSelectedButton(index);
    };

    const handleSearch = (query) => {
        console.log("seach query: ", query);
    }

    return (
        <div className="test-page mt-8">
            <div className="nav flex items-center justify-between">
                <div className="h-12 flex items-center gap-2 overflow-hidden">
                    {buttons.map((button, index) => (
                        <TaskButton
                            key={index}
                            text={button.text}
                            icon={button.icon}
                            count={button.count}
                            isSelected={selectedButton === index}
                            onClick={() => handleButtonClick(index)}
                        />
                    ))}
                </div>
                <div className="gap-2 flex">
                    <SearchButton
                        onSearchClick={() => handleSearch(searchQuery)}
                        value={searchQuery}
                        setValue={setSearchQuery}
                    />
                </div>
            </div>
            <div className="w-full flex flex-wrap gap-3 mt-10">
                {tests
                    .map((test) => (
                        <TestCard key={test.id} type={test.type}/>
                    ))}
            </div>
        </div>
    );
}

export default TestStudent;