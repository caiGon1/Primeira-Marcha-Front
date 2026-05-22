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
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function CadastroInstrutor() {
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
    cnh: "",
    credencialDetran: "",
    valorAula: "",
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
        "https://primeira-marcha-backend.vercel.app/instrutor",
        formData,
      );
      navigator("/dashboard-instrutor");
    } catch (error) {
      console.error("Erro ao cadastrar condutor:", error);
      console.log("Dados enviados:", formData);
      console.log("Resposta do servidor:", error.response);
      alert("Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const CadastroInstrutor = (
    <div className="h-screen w-screen flex items-center justify-center">
      <ArrowBackIosIcon
        className="absolute top-4 left-4 cursor-pointer"
        onClick={() => navigator("/")}
      />

      {/* elementos decorativos */}
      <img
        src="/img/+.svg"
        className="absolute top-10 left-1/2 -translate-x-30 w-12 opacity-100 hidden md:block"
      />
      <img
        src="/img/Group-48.svg"
        className="absolute bottom-0 translate-x-40 w-40 opacity-100 hidden md:block"
      />

      {/* lado esquerdo */}
      <div className="md:bg-[url('/img/logotransparente.png')] md:bg-no-repeat md:bg-position-[10%_0%]   md:bg-size-[250px] h-screen w-full md:w-1/2 flex items-center justify-center">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Box className="p-4 rounded flex flex-col gap-2 w-fit justify-center">
            <Stack spacing={2}>
              <h1 className="text-4xl font-poppins font-bold text-center">
                CADASTRO
              </h1>

              <h2 className="text-2xl font-poppins font-bold text-center">
                Possui uma conta?{" "}
                <a className="text-[rgba(227,126,30,1)]" href="/">
                  Conecte-se
                </a>
              </h2>

              <TextField
                required
                label="Nome Completo"
                name="nome"
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />

              <TextField
                required
                label="Email"
                name="email"
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />

              <CPFField
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Data de Nascimento"
                  disableFuture
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      dataNasc: value ? value.format("YYYY-MM-DD") : "",
                    })
                  }
                  slotProps={{
                    textField: {
                      InputProps: { sx: { borderRadius: "30px" } },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>

            <Stack spacing={2}>
              <TextField
                name="UF"
                label="UF"
                select
                required
                value={uf}
                onChange={(e) => {
                  handleChange(e);
                  setUf(e.target.value);
                }}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              >
                {ufs.map((estado) => (
                  <MenuItem key={estado.sigla} value={estado.sigla}>
                    {estado.sigla}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                disabled={!uf}
                options={cidades.map((cidade) => cidade.nome)}
                onChange={(e, value) =>
                  setFormData({ ...formData, cidade: value || "" })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Cidade" required />
                )}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />
            </Stack>

            <Stack spacing={2}>
              <HideShowPassword
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />

              <TextField
                label="Número da CNH"
                name="cnh"
                value={formData.cnh}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />

              <TextField
                label="Credencial Detran"
                name="credencialDetran"
                value={formData.credencialDetran}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />

              <TextField
                label="Valor por aula"
                name="valorAula"
                value={formData.valorAula}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderRadius: "30px" },
                }}
              />
            </Stack>

            <Button
              variant="outlined"
              type="submit"
              disabled={loading}
              sx={{
                borderRadius: "30px",
                width: "75%",
                alignSelf: "center",
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Cadastrar"}
            </Button>
          </Box>
        </form>
      </div>

      {/* lado direito */}
      <div className="hidden md:flex bg-cover h-full w-1/2 items-center justify-center flex-col bg-[url('/img/Ellipse-18.svg')]">
        <h1 className="text-4xl font-poppins font-bold text-center text-white">
          JÁ POSSUI UMA CONTA? <br />
          <span className="text-2xl">
            Caso já possua uma conta, clique em "Conecte-se" <br />e preencha os
            dados pedidos
          </span>
        </h1>

        <img src="/img/Group-81.svg" className="w-1/2" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {CadastroInstrutor}
    </motion.div>
  );
}

export default CadastroInstrutor;
