import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import CPFField from "../components/CPFField";
import HideShowPassword from "../components/HideShowPassword";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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
            <TextField required={true} label="Nome Completo" type="text"></TextField>
            <TextField required={true} label="Email" type="email"></TextField>
            <CPFField />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Data de Nascimento" disableFuture/>
              </LocalizationProvider>
          </Stack>
          <Stack spacing={2}>
            <TextField required={true} label="Número de CNH" type="text"></TextField>
            <TextField required={true} label="Credencial do Detran" type="text"></TextField>
          </Stack>
          <Stack spacing={2}>
            <HideShowPassword required={true} label="Senha" />
            <HideShowPassword required={true} label="Confirmar Senha" />
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
