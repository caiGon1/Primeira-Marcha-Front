import * as React from 'react';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { useNavigate } from 'react-router-dom';

export default function ModalCadastro({ modalOpen, setModalOpen }) {
  const navigator = useNavigate();
  const nodeRef = React.useRef(null);

  return (
    <React.Fragment>
      <Transition nodeRef={nodeRef} in={modalOpen} timeout={400}>
        {(state) => (
          <Modal
            ref={nodeRef}
            keepMounted
            open={!['exited', 'exiting'].includes(state)}
            onClose={() => setModalOpen(false)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: 'none',
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                    entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                  }[state],
                },
              },
            }}
            sx={[
              state === 'exited'
                ? { visibility: 'hidden' }
                : { visibility: 'visible' },
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
              <DialogTitle>Bem vindo(a) ao Primeira Marcha!</DialogTitle>
              <DialogContent>
                Selecione o tipo de cadastro que deseja realizar:
                <Stack spacing={2}>
                  <Button variant="outlined" color="neutral" onClick={() => navigator('/cadastrar-condutor')}>Sou condutor</Button>
                  <Button variant="outlined" color="neutral" onClick={() => navigator('/cadastrar-instrutor')}>Sou instrutor</Button>
                </Stack>
              </DialogContent>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  );
}