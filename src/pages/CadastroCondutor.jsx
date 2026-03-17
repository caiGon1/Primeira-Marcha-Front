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
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroCondutor() {
const UFs = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" }
];

  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    if (uf) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
      )
        .then((res) => res.json())
        .then((data) => setCidades(data));
    }
  }, [uf]);

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

    const handleSubmit = (e) => {
    e.preventDefault();

      navigator("/dashboard");
  };
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
            <TextField
              label="UF"
              required
              select
              value={uf}
              onChange={(e) => setUf(e.target.value)}
            >
              {UFs.map((estado) => (
                <MenuItem key={estado.sigla} value={estado.sigla}>
                  {estado.nome}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Cidade"
              required
              select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              disabled={!uf}
            >
              {cidades.map((cidade) => (
                <MenuItem key={cidade.id} value={cidade.nome}>
                  {cidade.nome}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack spacing={2}>
            <TextField
              required
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
          <Button
            variant="outlined"
            color="neutral"
            type="submit"
          >
            Cadastrar
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default CadastroCondutor;
