import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const BoxTitle = ({ boxTitle, boxes }) => {
  const checkIfTimeBox = (boxTitle) => {
    if (boxes[boxTitle].time) {
      return (
        <React.Fragment>
          <h3 className='box-status'>Time Box:</h3>
        </React.Fragment>
      );
    } else {
      return <h3 className='box-status'>Flex Box:</h3>;
    }
  };

  return (
    <StyledBoxTitle>
      <div>
        <h3>{boxTitle}</h3>
      </div>
      <div className='box-title-status'>{checkIfTimeBox(boxTitle)}</div>
    </StyledBoxTitle>
  );
};

export default connect(mapStateToProps)(BoxTitle);

function mapStateToProps(state) {
  return { boxes: state.boxes };
}

const StyledBoxTitle = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  .box-title-text {
    grid-column: 2;
    grid-row: 1;
  }
  .box-title-status {
    grid-column: 1;
    grid-row: 1;
    align-self: end;
  }
  .box-status {
    color: ${(props) => props.theme.colors.mediumGray};
  }
  h3 {
    padding: 0;
    margin: 0 5px 10px 0;
    color: ${(props) => props.theme.colors.darkBlue};
    font-size: ${(props) => props.theme.fontSizes.small};
  }
`;
