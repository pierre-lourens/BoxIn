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
          Average Times (Est. vs Atual) By Tag
        </li>
        <li onClick={() => handleClick("TimesByTag")}>Total Times By Tag</li>
        <li onClick={() => handleClick("LineGraph")}>
          Tasks Made & Completed (Last 14 Days)
        </li>
        <li onClick={() => handleClick("AverageTimesPerDay")}>
          Daily Time Trends
        </li>
        <li onClick={() => handleClick("TypesOfTasks")}>Types of Tasks</li>
      </ul>
    </React.Fragment>
  );
};

export default ReportsNav;
