import React from "react";

// should return a list of different reports
const ReportsNav = () => {
  const handleClick = (type) => {};

  return (
    <React.Fragment>
      <h3>Browse Reports</h3>
      <ul>
        <li>Box Score</li>
        <li onClick={() => handleClick("TasksOverTime")}>
          Tasks Made & Completed (Last 14 Days)
        </li>
        <li>Time Trends</li>
        <li>Types of Tasks</li>
      </ul>
    </React.Fragment>
  );
};

export default ReportsNav;
