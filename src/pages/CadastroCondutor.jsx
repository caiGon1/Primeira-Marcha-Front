import axios from "axios";
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
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

function CadastroCondutor() {
  const navigator = useNavigate();
  const [uf, setUf] = useState("");
  const [ufs, setUFs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    dataNasc: "",
    cidade: "",
    UF: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://primeira-marcha-backend.vercel.app/aluno",
        formData,
      );
      console.log("Resposta do servidor:", response.data);
      alert("Cadastro realizado com sucesso!");
      console.log(formData);
      navigator("/dashboard");
    } catch (error) {
      console.error("Erro ao cadastrar condutor:", error);
      console.log(formData);
      console.log(error.response ? error.response.data : error.message);
      alert("Erro ao realizar cadastro.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <ArrowBackIosIcon
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => navigator("/")}
      />
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Box className="p-4 rounded flex flex-col gap-2 w-fit justify-center border-2 border-gray-400">
          <Stack spacing={2}>
            <TextField
              required={true}
              label="Nome Completo"
              type="text"
              onChange={handleChange}
              name="nome"
            ></TextField>
            <TextField
              required={true}
              label="Email"
              type="email"
              onChange={handleChange}
              name="email"
            ></TextField>
            <CPFField name="cpf" value={formData.cpf} onChange={handleChange} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de Nascimento"
                disableFuture
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    dataNasc: value ? value.format("YYYY-MM-DD") : "",
                  });
                }}
                name="dataNasc"
              />
            </LocalizationProvider>
          </Stack>
          <Stack spacing={2}>
            <TextField
              name="UF"
              label="UF"
              required={true}
              select
              value={uf}
              onChange={(e) => {
                handleChange(e);
                setUf(e.target.value);
              }}
            >
              {ufs.map((estados) => (
                <MenuItem key={estados.sigla} value={estados.sigla}>
                  {estados.sigla}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              name="cidade"
              disabled={!uf}
              required={true}
              options={cidades.map((cidade) => cidade.nome)}
              onChange={(event, value) => {
                setFormData({
                  ...formData,
                  cidade: value || "",
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Cidade" required={true} />
              )}
            />
          </Stack>
          <Stack spacing={2}>
            <HideShowPassword
              name="senha"
              value={formData.senha}
              onChange={handleChange}
            />
          </Stack>
          <Button variant="outlined" color="neutral" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Cadastrar"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default CadastroCondutor;
