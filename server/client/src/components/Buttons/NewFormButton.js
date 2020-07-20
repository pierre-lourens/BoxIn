import React, { useState } from "react";

import styled from "styled-components";
import Modal from "react-overlays/Modal";
import NewBoxForm from "../Forms/NewBoxForm";
import PlusCircleIcon from "../../assets/PlusCircle";

// const Button = styled.button`
//   align-items: center;
//   align-content: center;
//   justify-content: center;
//   margin: 0.5rem;
//   padding: 0.5rem;
//   color: #000;
//   border: 1px solid #ddd;
//   background: #fff;
//   border-radius: 3px;
//   font-size: 1rem;
//   cursor: pointer;
//   grid-row: 1;
// `;

const Button = styled.button`
  cursor: pointer;
  display: inline-block;
  outline: none;
  background-color: inherit;
  border: 0;
  svg {
    height: 30px;

    top: 30px;
    color: ${(props) => props.theme.colors.lightBlue};

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

const NewFormButton = () => {
  const [show, setShow] = useState(false);

  const renderBackdrop = (props) => <Backdrop {...props} />;

  const hideModal = () => setShow(false);

  return (
    <React.Fragment>
      <Button onClick={() => setShow(true)}>
        <PlusCircleIcon />
      </Button>

      <FormModal
        show={show}
        onHide={() => setShow(false)}
        renderBackdrop={renderBackdrop}
        aria-labelledby='modal-label'>
        <NewBoxForm hideModal={hideModal} />
      </FormModal>
    </React.Fragment>
  );
};

export default NewFormButton;
