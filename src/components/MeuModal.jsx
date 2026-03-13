import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";

export default function MeuModal({openModal, setOpenModal}) {
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="close-modal-title"
        open={openModal}
        onClose={(_event, reason) => {
          setOpenModal(false);
        }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Sheet variant="outlined" sx={{ minWidth: 300, borderRadius: 'md', p: 3 }}>
          <ModalClose variant="outlined" />
          <Typography
            component="h2"
            id="close-modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: 'lg' }}
          >
            Modal title
          </Typography>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}