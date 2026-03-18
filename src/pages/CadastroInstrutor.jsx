import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import CPFField from "../components/CPFField";
import HideShowPassword from "../components/HideShowPassword";

function CadastroInstrutor() {
  const navigator = useNavigate();


    const handleSubmit = (e) => {
    e.preventDefault();
    navigator("/dashboard-instrutor");
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <ArrowBackIosIcon
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => navigator("/")}
      />
      <form onSubmit={handleSubmit}>
        <Box className="p-4 rounded flex flex-col gap-2 w-fit justify-center border-2 border-gray-400">
          <Stack spacing={2}>
            <TextField required label="Nome Completo" type="text"></TextField>
            <TextField required label="Email" type="email"></TextField>
            <CPFField />
                      <TextField
                          required
              label="Data de Nascimento"
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
            ></TextField>
          </Stack>
          <Stack spacing={2}>
            <TextField required label="Número de CNH" type="text"></TextField>
            <TextField required label="Credencial do Detran" type="text"></TextField>
          </Stack>
          <Stack spacing={2}>
            <HideShowPassword label="Senha" />
            <HideShowPassword label="Confirmar Senha" />
          </Stack>
          <Button variant="outlined" color="neutral" type="submit">
            Cadastrar
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default CadastroInstrutor;
