import React, { useState } from "react";

import PencilAltIcon from "../../assets/PencilAltIcon";
import styled from "styled-components";
import Modal from "react-overlays/Modal";
import EditTaskForm from "../Forms/EditTaskForm";

const Button = styled.button`
  svg {
    height: 25px;
    width: 100%;
    color: ${(props) => props.theme.colors.mediumGray}
    &: hover {
      color: ${(props) => props.theme.colors.primaryBlue};
    }
  }
`;

const Backdrop = styled("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
`;

const FormModal = styled(Modal)`
  position: fixed;
  outline: none;
  width: 330px;
  z-index: 1040;
  top: 5%;
  left: 50%;
  transform: translate(-50%, 0);
  border: 0;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.evenWhiterThanOffWhite};
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.4);
`;

const EditTaskButton = ({ task }) => {
  const [show, setShow] = useState(false);

  const renderBackdrop = (props) => <Backdrop {...props} />;

  const hideModal = () => setShow(false);

  return (
    <React.Fragment>
      <Button onClick={() => setShow(true)}>
        <PencilAltIcon />
      </Button>

      <FormModal
        show={show}
        onHide={() => setShow(false)}
        renderBackdrop={renderBackdrop}
        aria-labelledby='modal-label'>
        <EditTaskForm task={task} hideModal={hideModal} />
      </FormModal>
    </React.Fragment>
  );
};

export default EditTaskButton;
