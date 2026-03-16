import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { useNavigate } from "react-router-dom";

export default function ModalCadastro({ openModal, setOpenModal }) {
  const navigator = useNavigate();
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="close-modal-title"
        open={openModal}
        onClose={(_event, reason) => {
          setOpenModal(false);
        }}
        sx={{
          display: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{ minWidth: 300, borderRadius: "md", p: 3 }}
        >
          <ModalClose variant="outlined" />
          <Typography
            component="h2"
            id="close-modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg" }}
          >
            Bem vindo ao Primeira Marcha!
          </Typography>
          <Typography level="body2" sx={{ mt: 1 }}>
            Para começar, selecione o tipo de cadastro:
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Button onClick={() => navigator("/cadastrar-instrutor")} variant="outlined" color="neutral">
                Sou instrutor
              </Button>
              <Button onClick={() => navigator("/cadastrar-condutor")} variant="outlined" color="neutral">
                Sou condutor
              </Button>
            </Stack>
          </Typography>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
