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
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center ">
        <img
          src="/img/+.svg"
          className="absolute top-10 left-1/2 translate-x-30 w-12 opacity-100 hidden md:block"
        />
        <img
          src="/img/Group-48.svg"
          className="absolute bottom-0 -translate-x-20 w-40 opacity-100 hidden md:block"
        />

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
          className="hidden md:flex bg-cover h-full w-8/14 items-center justify-center flex-col
             bg-[url('/img/Ellipse-17.png')]"
        >
          <h1 className="text-4xl font-poppins font-bold italic text-[#102542]">
            BEM-VINDO(A) AO
          </h1>
          <img src="/img/pmlogo.png" alt="" />
          <img
            src="/img/Group-148.png"
            alt=""
            className="w-[650px] h-[650px]"
          />
        </div>

        <Box
          className="p-4 rounded flex w-full md:w-2/4 h-full flex-col items-center justify-center gap-10 
             md:bg-[url('/img/logotransparente.png')] md:bg-no-repeat md:bg-[position:95%_top] md:bg-[length:300px]"
        >
          <div className="text-center w-full max-w-md">
            <img
              src="/img/logotransparente.png"
              alt="logo"
              className="w-80 h-40 mb-6 mx-auto block md:hidden"
            />

            <h1 className="text-6xl font-poppins font-bold italic">LOGIN</h1>

            <h2 className="text-2xl mb-8 font-poppins">
              Não tem uma conta?{" "}
              <a
                onClick={() => setModalOpen(true)}
                className="w-24 cursor-pointer font-bold text-[#df7f01]"
              >
                Cadastre-se
              </a>
            </h2>

            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
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
                required
                name="senha"
                value={formData.senha}
                fullWidth
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "30px",
                    },
                  },
                }}
              />

              <div className="flex items-center flex-col p-4">
                <a
                  href=""
                  className="font-poppins text-center text-sm text-[#df7f01] font-bold "
                >
                  Esqueci minha senha
                </a>

                <Button
                  className="border-2 rounded border-gray-400"
                  type="submit"
                  disabled={loading}
                  variant="outlined"
                  color="default"
                  sx={{
                    borderRadius: "30px",
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
    </motion.div>
  );
}

export default Login;
