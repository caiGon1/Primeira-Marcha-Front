import * as React from 'react';
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';


export default function MeuModal({ openModal, setOpenModal }) {
  const nodeRef = React.useRef(null);
  
  return (
    <React.Fragment>
      <Transition nodeRef={nodeRef} in={openModal} timeout={400}>
        {(state) => (
          <Modal
            ref={nodeRef}
            keepMounted
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpenModal(false)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
            sx={[
              state === "exited"
                ? { visibility: "hidden" }
                : { visibility: "visible" },
            ]}
          >
            <ModalDialog
              sx={{
                opacity: 0,
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <DialogTitle>
                Modal title
              </DialogTitle>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  );
}
