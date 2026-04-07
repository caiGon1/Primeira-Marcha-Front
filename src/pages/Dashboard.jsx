import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import MeuDrawer from "../components/MeuDrawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Autocomplete,
  Button,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";

function Dashboard() {
  const navigator = useNavigate();

  const [openMenu, setMenuOpen] = React.useState(false);
  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [professorOpen, setProfessorOpen] = React.useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [value, setValue] = React.useState(dayjs(null));
  const [aulas, setAulas] = React.useState([]);
  const [reserva, setReserva] = React.useState([]);
  const [user, setUser] = React.useState([{ nome: "Carregando..." }]);
  const [nomePerfilOpen, setNomePerfilOpen] = React.useState(false);
  const [emailPerfilOpen, setEmailPerfilOpen] = React.useState(false);
  const [cidadePerfilOpen, setCidadePerfilOpen] = React.useState(false);
  const [ufPerfilOpen, setUfPerfilOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [cidades, setCidades] = useState([]);

  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaCidade, setNovaCidade] = useState("");
  const [novaUF, setNovaUF] = useState("");

  useEffect(() => {

  if (user.UF) {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${user.UF}/municipios`)
      .then((res) => res.json())
      .then((data) => setCidades(data));
  }
 }, [user.UF]);
  
  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      try {
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(res.data);
        console.log("Dados do usuário:", res.data);
        console.log(token)
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        alert("Erro ao buscar dados do usuário.");
      }
    };
    fetchUser();
  }, []);

  const handleSubmitNome = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
        { nome: novoNome },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Nome atualizado com sucesso!");
    } catch (err) {
      console.error(
        "Erro ao atualizar nome:",
        err.response?.data || err.message,
      );
      alert("Erro ao atualizar nome.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
        { email: novoEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Email atualizado com sucesso!");
    } catch (err) {
      console.error(
        "Erro ao atualizar email:",
        err.response?.data || err.message,
      );
      alert("Erro ao atualizar email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCidade = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
        { cidade: novaCidade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Cidade atualizada com sucesso!");
    } catch (err) {
      console.error(
        "Erro ao atualizar cidade:",
        err.response?.data || err.message,
      );
      alert("Erro ao atualizar cidade.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUF = async (e) => {
    e.preventDefault();
    // Similar to handleSubmitNome, but for UF
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <MeuModal open={perfilOpen} onClose={() => setPerfilOpen(false)}>
        <p>Olá, {user.nome}! O que gostaria de fazer hoje?</p>
        <Button
          onClick={() => {
            setNomePerfilOpen(true);
            setPerfilOpen(false);
          }}
        >
          Alterar nome
        </Button>
        <Button
          onClick={() => {
            setEmailPerfilOpen(true);
            setPerfilOpen(false);
          }}
        >
          Alterar email
        </Button>
        <Button
          onClick={() => {
            setCidadePerfilOpen(true);
            setPerfilOpen(false);
          }}
        >
          Alterar cidade
        </Button>
        <Button onClick={() => {}}>Alterar UF</Button>
      </MeuModal>

      <MeuModal open={nomePerfilOpen} onClose={() => setNomePerfilOpen(false)}>
        <DialogTitle>Alterar nome</DialogTitle>
        <p>Nome atual: {user.nome}</p>

        <form onSubmit={handleSubmitNome}>
          <TextField
            type="text"
            placeholder="Novo nome"
            value={novoNome}
            disabled={loading}
            onChange={(e) => setNovoNome(e.target.value)}
          />

          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>

      <MeuModal
        open={emailPerfilOpen}
        onClose={() => setEmailPerfilOpen(false)}
      >
        <DialogTitle>Alterar email</DialogTitle>
        <p>Email atual: {user.email}</p>
        <form onSubmit={handleSubmitEmail}>
          <TextField
            type="email"
            placeholder="Novo email"
            value={novoEmail}
            disabled={loading}
            onChange={(e) => setNovoEmail(e.target.value)}
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
        <p>Cidade atual: {user.cidade}</p>
        <form onSubmit={handleSubmitCidade}>
          <Autocomplete
            options={cidades.map((cidade) => cidade.nome)}
            loadingText="Carregando cidades..."
            noOptionsText="Nenhuma cidade encontrada"
            renderInput={(params) => <TextField {...params} label="Cidades" />}
          />
          <Button type="submit">
            {loading ? <CircularProgress size={20} /> : "Salvar"}
          </Button>
        </form>
      </MeuModal>

      <MeuModal open={ufPerfilOpen} onClose={() => setUfPerfilOpen(false)}>
        <DialogTitle>Alterar UF</DialogTitle>
        <p>UF atual: {user.uf}</p>
        <Button onClick={() => {}}>Salvar</Button>
      </MeuModal>

      <MeuModal open={horariosOpen} onClose={() => setHorariosOpen(false)}>
        <DialogTitle>Selecione um dia e horário para você!</DialogTitle>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            disablePast
            label="Dia & Horário"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            slotProps={{
              textField: {
                error: false,
              },
            }}
          />
        </LocalizationProvider>
        <Button
          onClick={() => {
            setHorariosOpen(false);
            setProfessorOpen(true);
          }}
          className="mt-2"
          variant="outlined"
          color="neutral"
        >
          Procurar um professor
        </Button>
      </MeuModal>

      <MeuModal open={professorOpen} onClose={() => setProfessorOpen(false)}>
        <DialogTitle>Professores disponíveis</DialogTitle>
        <List>
          <ListItem>
            Professor 1 - 150 reais{" "}
            <Button
              onClick={() => {
                setProfessorOpen(false);
                setAlertOpen(true);
                setAulas([
                  ...aulas,
                  { professor: "Professor 1", horario: value, reservada: true },
                ]);
                setReserva([
                  ...reserva,
                  { professor: "Professor 1", preco: 150 },
                ]);
              }}
            >
              Agendar
            </Button>
          </ListItem>
          <ListItem>
            Professor 2 - 200 reais{" "}
            <Button
              onClick={() => {
                setProfessorOpen(false);
                setAlertOpen(true);
                setAulas([
                  ...aulas,
                  { professor: "Professor 2", horario: value, reservada: true },
                ]);
                setReserva([
                  ...reserva,
                  { professor: "Professor 2", preco: 200 },
                ]);
              }}
            >
              Agendar
            </Button>
          </ListItem>
          <ListItem>
            Professor 3 - 300 reais{" "}
            <Button
              onClick={() => {
                setProfessorOpen(false);
                setAlertOpen(true);
                setAulas([
                  ...aulas,
                  { professor: "Professor 3", horario: value, reservada: true },
                ]);
                setReserva([
                  ...reserva,
                  { professor: "Professor 3", preco: 300 },
                ]);
              }}
            >
              Agendar
            </Button>
          </ListItem>
        </List>
      </MeuModal>

      <MeuModal open={carrinhoOpen} onClose={() => setCarrinhoOpen(false)}>
        <DialogTitle>Seu Carrinho</DialogTitle>
        <List>
          {reserva.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            reserva.map((item, index) => (
              <ListItem key={index}>
                {item.professor} - R$ {item.preco}
                <Button
                  onClick={() => {
                    const newReserva = [...reserva];
                    newReserva.splice(index, 1);
                    setReserva(newReserva);
                  }}
                >
                  <Delete />
                </Button>
                <Button
                  onClick={() => {
                    aulas.find(
                      (aula) => aula.professor === item.professor,
                    ).reservada = false;
                    setAulas([...aulas]);
                    setReserva(reserva.filter((_, i) => i !== index));
                    setCarrinhoOpen(false);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Pagar
                </Button>
              </ListItem>
            ))
          )}
        </List>
      </MeuModal>

      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity="success">
          Aula reservada com sucesso! Deseja ver seu carrinho?{" "}
          <Button onClick={() => setCarrinhoOpen(true)}>
            Visualizar Carrinho
          </Button>
        </Alert>
      </Snackbar>

      <MeuDrawer openMenu={openMenu} setOpenMenu={setMenuOpen} />

      <header className="flex gap-3 justify-center">
        <Button onClick={() => navigator("/")}>Logout</Button>
        <Button onClick={() => setPerfilOpen(true)}>Perfil</Button>
        <Button>Notificações</Button>
        <Button onClick={() => setMenuOpen(true)}>Chat</Button>
      </header>
      <Box className="flex flex-row gap-10 justify-center p-3">
        <Box className="h-fit w-fit">
          <h1 className="text-center">Proximas Aulas</h1>
          <List className="flex flex-col gap-2 border-2 rounded p-2">
            {aulas.length === 0 ? (
              <p className="text-center">Nenhuma aula agendada</p>
            ) : (
              aulas.map((aula, index) => (
                <ListItem
                  key={index}
                  className="flex flex-row gap-2 justify-between"
                >
                  <Stack
                    direction="row"
                    gap={2}
                    justifyContent="space-between"
                    alignItems="center"
                  ></Stack>
                  {aula.professor} - {aula.horario.format("DD/MM/YYYY HH:mm")} -{" "}
                  {aula.reservada ? "Reservada" : "Paga"}
                  <Button>
                    <Delete
                      onClick={() => {
                        const newAulas = [...aulas];
                        newAulas.splice(index, 1);
                        setAulas(newAulas);
                      }}
                    />
                  </Button>
                  <Stack />
                </ListItem>
              ))
            )}
          </List>
        </Box>
        <Stack direction="column" gap={2} alignItems="center">
          <Button
            onClick={() => setHorariosOpen(true)}
            className="p-2 border-2 rounded w-fit h-fit"
            variant="outlined"
            color="neutral"
          >
            Agendar uma aula
          </Button>
          <Button
            onClick={() => setCarrinhoOpen(true)}
            variant="outlined"
            color="neutral"
            className="h-fit w-fit"
          >
            Carrinho
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default Dashboard;
