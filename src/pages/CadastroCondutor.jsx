import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CPFField from "../components/CPFField";
import HideShowPassword from "../components/HideShowPassword";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function CadastroCondutor() {

  const [uf, setUf] = useState("");
  const [ufs, setUFs] = useState([]);
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


  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((data) => setUFs(data));
  }, []);


  const navigator = useNavigate();

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
            <CPFField />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Data de Nascimento" disableFuture/>
              </LocalizationProvider>
          </Stack>
          <Stack spacing={2}>
            <TextField
              label="UF"
              required
              select
              value={uf}
              onChange={(e) => setUf(e.target.value)}
            >
              {ufs.map((estados) => (
                <MenuItem key={estados.sigla} value={estados.sigla}>
                  {estados.sigla}
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
                <MenuItem key={cidade.nome} value={cidade.nome}>
                  {cidade.nome}
                </MenuItem>
              ))}
            </TextField>
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

export default CadastroCondutor;
