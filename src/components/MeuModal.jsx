import * as React from "react";
import { Transition } from "react-transition-group";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";

export default function MeuModal({ open, onClose, children }) {
  const nodeRef = React.useRef(null);

  return (
    <Transition nodeRef={nodeRef} in={open} timeout={400}>
      {(state) => (
        <Modal
          ref={nodeRef}
          keepMounted
          open={!["exited", "exiting"].includes(state)}
          onClose={onClose}
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
            {children}
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}
