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
import CircularProgress from "@mui/material/CircularProgress";
import { RoundedCorner, WidthFull } from "@mui/icons-material";

function Login() {
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const response = await axios.post(
        "https://primeira-marcha-backend.vercel.app/aluno/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.aluno._id);

      navigator("/dashboard");
    } catch (error) {
      try {
        const response = await axios.post(
          "https://primeira-marcha-backend.vercel.app/instrutor/login",
          formData,
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.instrutor.id);

        navigator("/dashboard-instrutor");
      } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert("Erro ao realizar login.");
        console.log(formData);
        console.log(error.response ? error.response.data : error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center">
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

      <div
        className="hidden md:flex bg-cover h-full w-8/14 items-center justify-center"
        style={{ backgroundImage: "url('/public/img/Ellipse-17.png')" }}
      >
        <img src="/public/img/Group-148.png" alt="" className="w-[650px] h-[650px]" />
      </div>
      <Box
        className="p-4 rounded flex w-full md:w-2/4 h-full flex-col items-center justify-center gap-10 
             md:bg-[url('/public/img/logotransparente.png')] md:bg-no-repeat md:bg-[position:95%_top] md:bg-[length:300px]"
      >
        <div className="text-center w-full max-w-md">
          {" "}
          <img
            src="/public/img/logotransparente.png"
            alt="logo"
            className="w-80 h-40 mb-6 mx-auto block md:hidden"
          />
          <h1 className="text-6xl font-poppins">LOGIN</h1>
          <h2 className="text-2xl mb-8 font-poppins">
            {" "}
            Não tem uma conta?{" "}
            <a
              onClick={() => setModalOpen(true)}
              className="w-24 cursor-pointer font-bold"
            >
              Cadastre-se
            </a>
          </h2>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <TextField
              id="outlined-email-input"
              label="Email"
              name="email"
              type="email"
              fullWidth
              required={true}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "30px",
                  },
                },
              }}
            />

            <HideShowPassword
              required={true}
              name="senha"
              value={formData.senha}
              fullWidth // Garante que o componente de senha siga o mesmo tamanho
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "30px",
                  },
                },
              }}
            />
            <div className="flex items-center justify-centerl flex-col p-4">
              <a href="" className="font-poppins text-center text-sm">
                Esqueci minha senha
              </a>
              <Button
                className="border-2 rounded border-gray-400"
                type="submit"
                disabled={loading}
                variant="outlined"
                color="default"
                sx={{
                  width: "50%",
                }}
              >
                {loading ? <CircularProgress size={20} /> : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
}

export default Login;
