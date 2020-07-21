import React from "react";

// should return a list of different reports
const ReportsNav = ({ setCurrentGraph }) => {
  const handleClick = (type) => {
    setCurrentGraph(type);
  };

  return (
    <React.Fragment>
      <h3>Browse Reports</h3>
      <ul>
        <li onClick={() => handleClick("BoxScore")}>Box Score</li>
        <li onClick={() => handleClick("TimeBreakdownByTag")}>
          Average Times By Tag
        </li>
        <li onClick={() => handleClick("TimesByTag")}>Total Times By Tag</li>
        <li onClick={() => handleClick("LineGraph")}>
          Task Busyness (Last 14 days)
        </li>
        <li onClick={() => handleClick("AverageTimesPerDay")}>
          Trends Over Time per Day of the Week
        </li>
        <li onClick={() => handleClick("TypesOfTasks")}>Types of Tasks</li>
      </ul>
    </React.Fragment>
  );
};

export default ReportsNav;
