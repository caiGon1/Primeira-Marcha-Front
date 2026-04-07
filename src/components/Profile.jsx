import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fontsource/inter";

import MeuModal from "../components/MeuModal";
import HideShowPassword from "./HideShowPassword";

import {
  Button,
  DialogTitle,
  TextField,
  CircularProgress
} from "@mui/material";

function Profile({ open, onClose }) {
  const [user, setUser] = useState(null);

  const [nomePerfilOpen, setNomePerfilOpen] = useState(false);
  const [emailPerfilOpen, setEmailPerfilOpen] = useState(false);
  const [senhaPerfilOpen, setSenhaPerfilOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      try {
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);






  const updateUser = async (data) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    try {
      setLoading(true);

      await axios.put(
        `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };



  if (!user) return null;

  return (
    <>

      <MeuModal open={open} onClose={onClose}>
        <p>Olá, {user.nome}!</p>

        <Button onClick={() => setNomePerfilOpen(true)}>
          Alterar nome
        </Button>

        <Button onClick={() => setEmailPerfilOpen(true)}>
          Alterar email
        </Button>

        <Button onClick={() => setSenhaPerfilOpen(true)}>
          Alterar senha
        </Button>
      </MeuModal>

      <MeuModal open={nomePerfilOpen} onClose={() => setNomePerfilOpen(false)}>
        <DialogTitle>Alterar nome</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ nome: novoNome });
          }}
        >
          <TextField
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            fullWidth
          />

          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>


      <MeuModal open={emailPerfilOpen} onClose={() => setEmailPerfilOpen(false)}>
        <DialogTitle>Alterar email</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ email: novoEmail });
          }}
        >
          <TextField
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
            fullWidth
          />

          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>

      <MeuModal open={senhaPerfilOpen} onClose={() => setSenhaPerfilOpen(false)}>
        <DialogTitle>Alterar senha</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ senha: novaSenha });
          }}
        >
          <HideShowPassword
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            fullWidth
          />

          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>
    </>
  );
}

export default Profile;