import React, { useState, useEffect } from "react";

const Leaderboard = ({ leaders }) => {
    const [selectedGroup, setSelectedGroup] = useState("Усі групи");
    const [filteredLeaders, setFilteredLeaders] = useState([]);

    const groups = ["Усі групи", ...new Set(leaders.map((leader) => leader.group))];

    useEffect(() => {
        const getFilteredLeaders = () => {
            if (selectedGroup === "Усі групи") {
                return Array.from(new Map(leaders.map((leader) => [leader.email, leader])).values());
            } else {
                return leaders.filter((leader) => leader.group === selectedGroup);
            }
        };

        setFilteredLeaders(getFilteredLeaders());
    }, [leaders, selectedGroup]);

    return (
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-full leaders">
            {/* Filter by Group */}
            <div className="flex justify-between">
                <div
                    className="text-lg font-semibold w-auto pl-3"
                    style={{
                        fontFamily: "Nunito",
                        fontWeight: "700",
                        fontSize: "20pt",
                        lineHeight: "32.74pt",
                        letterSpacing: "-0.5%",
                        color: "#120C38",
                    }}
                >
                    Таблиця лідерів
                </div>
                <select
                    className="border pr-3 w-auto custom-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    style={{
                        fontFamily: "Nunito",
                        fontWeight: "700",
                        fontSize: "12pt",
                        lineHeight: "20.46pt",
                        letterSpacing: "-0.5%",
                        color: "#827FAE",
                        border: "1px solid #D7D7D7",
                        borderRadius: "9999px",
                    }}
                >
                    {/* Options for selecting a group */}
                    {groups.map((group, index) => (
                        <option key={index} value={group}>
                            {group}
                        </option>
                    ))}
                </select>
            </div>

            {/* Leaderboard List */}
            <ol className="mt-4 overflow-y-auto h-[calc(100%-60px)] pl-4">
                {filteredLeaders.map((leader, index) => (
                    <li key={leader.email} className="mb-2 flex items-center">
                        {/* Rank Circle */}
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                    index === 0 ? "#120C38" : index === 1 ? "#8A48E6" : index === 2 ? "#88F2FF" : "transparent",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "10px",
                                color: index < 3 ? "white" : "#120C38",
                                fontWeight: "600",
                                fontSize: "13pt",
                                fontFamily: "Lato",
                                lineHeight: "15.6pt",
                                letterSpacing: "0%",
                            }}
                        >
                            {index + 1}
                        </div>

                        {/* Profile Image */}
                        <img
                            src={leader.image ? leader.image : "/assets/images/avatar.jpg"}
                            alt={`${leader.name}'s profile`}
                            onError={(e) => {
                                e.target.src = "/assets/images/avatar.jpg";
                            }}
                            style={{
                                width: "30pt",
                                height: "30pt",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginRight: "10px",
                                border: "1px solid #ccc",
                            }}
                        />

                        {/* Leader Details */}
                        <div
                            style={{
                                fontFamily: "Mulish",
                                fontWeight: index === 0 ? "700" : "400",
                                fontSize: "15pt",
                                lineHeight: "18.83pt",
                                letterSpacing: "-0.5%",
                                color: "#120C38",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Mulish",
                                    fontWeight: index === 0 ? "700" : "400",
                                    fontSize: "15pt",
                                    lineHeight: "18.83pt",
                                    letterSpacing: "-0.5%",
                                    color: "#120C38",
                                }}
                            >
                                {leader.name}
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;