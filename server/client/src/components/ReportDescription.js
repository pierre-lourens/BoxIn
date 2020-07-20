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
    console.log("currentGraph is", this.props.currentGraph);
    let newTitle;
    let newDescription;

    switch (this.props.currentGraph) {
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
