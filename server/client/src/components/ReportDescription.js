import React from "react";

const ReportDescription = (props) => {
  const renderCurrentGraph = () => {
    let title;
    let description;

    switch (props.currentGraph) {
      case "LineGraph":
        title = "Tasks Made & Completed";
        description =
          "This report plots how many tasks you have added and completed over the past 14 days, including today.";
      case "AverageTimesPerDay":
        title = "Daily Time Trends";
        description =
          "This report shows the average tracked time per day and how it relates to completed and started tasks. All historical data is averaged.";
    }

    return (
      <React.Fragment>
        <h3>
          About <span>{title}</span>
        </h3>
        <p>{description}</p>
      </React.Fragment>
    );
  };

  return <React.Fragment>{renderCurrentGraph()}</React.Fragment>;
};

export default ReportDescription;
