import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from "mdb-react-ui-kit";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Confirmar", message = "¿Estás seguro?" }) => {
  return (
    <MDBModal show={isOpen} setShow={onClose} staticBackdrop tabIndex="-1" style={{zIndex: 5555}}>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title}</MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>{message}</MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              No
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => {
                onConfirm();
                //onClose(); // cerrar modal al confirmar
              }}
            >
              Sí
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ConfirmModal;