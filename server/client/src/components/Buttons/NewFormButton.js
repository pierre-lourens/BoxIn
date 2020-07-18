import React, { useState } from "react";

import styled from "styled-components";
import Modal from "react-overlays/Modal";
import NewBoxForm from "../Forms/NewBoxForm";

const Button = styled.button`
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
  grid-row: 1;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
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
        <svg width='24' height='24' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z'
          />
        </svg>
        <ButtonText>Add A Box</ButtonText>
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
