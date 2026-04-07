import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fontsource/inter";

import MeuModal from "../components/MeuModal";

import {
  Button,
  DialogTitle,
  TextField,
  CircularProgress,
  Autocomplete,
  Stack,
  MenuItem,
} from "@mui/material";

function Profile({ open, onClose }) {
  const [user, setUser] = useState(null);

  const [nomePerfilOpen, setNomePerfilOpen] = useState(false);
  const [emailPerfilOpen, setEmailPerfilOpen] = useState(false);
  const [cidadePerfilOpen, setCidadePerfilOpen] = useState(false);
  const [ufPerfilOpen, setUfPerfilOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [cidades, setCidades] = useState([]);
  const [cidadesUf, setCidadesUf] = useState([]);
  const [ufs, setUFs] = useState([]);

  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaCidade, setNovaCidade] = useState("");
  const [novaUF, setNovaUF] = useState("");


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


  useEffect(() => {
    if (!user?.UF) return;

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${user.UF}/municipios`
    )
      .then((res) => res.json())
      .then(setCidades);
  }, [user]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then(setUFs);
  }, []);

  useEffect(() => {
    if (!novaUF) return;

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${novaUF}/municipios`
    )
      .then((res) => res.json())
      .then(setCidadesUf);
  }, [novaUF]);



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

        <Button onClick={() => setCidadePerfilOpen(true)}>
          Alterar cidade
        </Button>

        <Button onClick={() => setUfPerfilOpen(true)}>
          Alterar UF
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

      <MeuModal
        open={cidadePerfilOpen}
        onClose={() => setCidadePerfilOpen(false)}
      >
        <DialogTitle>Alterar cidade</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ cidade: novaCidade });
          }}
        >
          <Autocomplete
            options={cidades.map((c) => c.nome)}
            value={novaCidade}
            onChange={(e, value) => setNovaCidade(value)}
            renderInput={(params) => (
              <TextField {...params} label="Cidade" />
            )}
          />

          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>


      <MeuModal open={ufPerfilOpen} onClose={() => setUfPerfilOpen(false)}>
        <DialogTitle>Alterar UF</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({
              UF: novaUF,
              cidade: novaCidade,
            });
          }}
        >
          <Stack gap={2}>
            <TextField
              select
              value={novaUF}
              onChange={(e) => setNovaUF(e.target.value)}
            >
              {ufs.map((uf) => (
                <MenuItem key={uf.sigla} value={uf.sigla}>
                  {uf.sigla}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              disabled={!novaUF}
              options={cidadesUf.map((c) => c.nome)}
              onChange={(e, value) => setNovaCidade(value)}
              renderInput={(params) => (
                <TextField {...params} label="Cidade" />
              )}
            />
          </Stack>

          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>
    </>
  );
}

export default Profile;