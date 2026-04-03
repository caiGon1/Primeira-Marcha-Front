import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import * as React from "react";
import MeuModal from "../components/MeuModal";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import HideShowPassword from "../components/HideShowPassword";

function Login() {
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://primeira-marcha-backend.vercel.app/aluno/login",
        formData,
      );

      alert("Login realizado com sucesso!");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.aluno._id);

      navigator("/dashboard");
    } catch (error) {
      alert("Erro ao realizar login.");
      console.log(formData);
      console.log(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <MeuModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle sx={{ pb: 0 }}>
          Bem vindo(a) ao Primeira Marcha!
        </DialogTitle>
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
              required={true}
              onChange={handleChange}
            />

            <HideShowPassword
              required={true}
              name="senha"
              value={formData.senha}
              onChange={handleChange}
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
