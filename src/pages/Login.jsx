import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import * as React from "react";
import MeuModal from "../components/MeuModal";
import ModalDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function Login() {
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;

    if (email === "instrutor@email.com") {
      navigator("/dashboard-instrutor");
    } else {
      navigator("/dashboard");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <MeuModal open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle sx={{ pb : 0 }}>Bem vindo(a) ao Primeira Marcha!</DialogTitle>
          <DialogContent>
            Selecione o tipo de cadastro que deseja realizar:
            <Stack spacing={1}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => navigator("/cadastrar-condutor")}
              >
                Sou condutor
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => navigator("/cadastrar-instrutor")}
              >
                Sou instrutor
              </Button>
            </Stack>
          </DialogContent>
      </MeuModal>

      <Box className="p-4 rounded flex gap-2 w-fit flex-col items-center justify-center  border-2 border-gray-400">
        <h1>Login</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="grid grid-rows-2 gap-2">
            <TextField
              id="outlined-email-input"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required="true"
            />

            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              required="true"
            />
          </div>
          <button className="border-2 rounded border-gray-400" type="submit">
            Login
          </button>
        </form>
        <button
          onClick={() => setModalOpen(true)}
          className="border-2 rounded border-gray-400 w-24 cursor-pointer"
        >
          Cadastrar
        </button>
      </Box>
    </div>
  );
}

export default Login;
