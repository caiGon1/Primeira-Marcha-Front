import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

function CadastroInstrutor() {
  const navigator = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <ArrowBackIosIcon
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => navigator("/")}
      />
      <form action='/dashboard-instrutor' method="post">
        <Box className="p-4 rounded flex flex-col gap-2 w-fit justify-center border-2 border-gray-400">
          <Stack spacing={2}>
            <TextField required label="Nome Completo" type="text"></TextField>
            <TextField required label="Email" type="email"></TextField>
            <TextField required label="CPF" type="text"></TextField>
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
            <TextField required
              label="Senha"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
                      <TextField
                          required
              label="Confirmar Senha"
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Button variant="outlined" color="neutral" type="submit" onClick={()=>navigator("/dashboard-instrutor")}>
            Cadastrar
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default CadastroInstrutor;
