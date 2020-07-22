import React from "react";

class ReportDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "", description: "" };
  }

  componentDidMount(prevProps) {
    this.renderCurrentGraph();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.currentGraph !== this.props.currentGraph) {
      this.renderCurrentGraph();
    }
  }
  renderCurrentGraph = () => {
    // console.log("currentGraph is", this.props.currentGraph);
    let newTitle;
    let newDescription;

    switch (this.props.currentGraph) {
      case "BoxScore":
        newTitle = "Box Score";
        newDescription =
          "If you track and finish a task 5 minutes before the estimated time, you earn 100 points. If you are 5 minutes over or less, you earn 50 points. If your actual time is 20 minutes or more different than your estimate, you LOSE 50 points. New tasks earns 10 points and completed task earns 20 points.";
        break;
      case "TimeBreakdownByTag":
        newTitle = "Average Times (Estimated vs Actual)";
        newDescription =
          "To help you review and plan better, check out which types of tasks you under or overestimate.";
        break;
      case "TimesByTag":
        newTitle = "Total Times By Tag";
        newDescription =
          "This graph shows where all your time has gone (by tag). Consider if there are areas you'd like to decrease or increase.";
        break;
      case "LineGraph":
        newTitle = "Tasks Made & Completed";
        newDescription =
          "This report plots how many tasks you have added and completed over the past 14 days, including today.";
        break;
      case "AverageTimesPerDay":
        newTitle = "Daily Time Trends";
        newDescription =
          "This report shows the average tracked time per day and how it relates to completed and started tasks. All historical data is averaged.";
        break;
      case "TypesOfTasks":
        newTitle = "Types of Task You Do";
        newDescription =
          "This report shows the respective proportion of tasks in your database that match a given tag. This reflects the pure number of tasks, not the time spent.";
        break;
      default:
        newTitle = "chart found";
        newDescription = "This should not show up";
        break;
    }

    this.setState({ title: newTitle });
    this.setState({ description: newDescription });
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          About <span>{this.state.title}</span>
        </h3>
        <p>{this.state.description}</p>
      </React.Fragment>
    );
  }
}

export default ReportDescription;
