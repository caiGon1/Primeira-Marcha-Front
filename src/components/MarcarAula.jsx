import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import * as React from "react";
import MeuModal from "./MeuModal";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, List, Snackbar, Alert } from "@mui/material";
import { ListItemButton, ListItemText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "@fontsource/inter";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ListItemIcon } from "@mui/material";

function MarcarAula({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [value, setValue] = useState(null);
  const [localizacao, setLocalizacao] = useState(false);
  const [professores, setProfessores] = useState(false);

  const [instrutores, setInstrutores] = useState([]);
  const [user, setUser] = useState({ nome: "Carregando..." });
  const [instrutorSelecionado, setInstrutorSelecionado] = useState("");
  const [data, setData] = useState("");
  const [localdeAula, setLocaldeAula] = useState("");

  const marcarAula = async (e) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "https://primeira-marcha-backend.vercel.app/aula",
        {
          alunoId: user.id,
          instrutorId: instrutorSelecionado.id,
          dataIncio: data,
          dataFinal: data,
          localdeAula: localdeAula,
          statusAula: "Pendente",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Aula marcada com sucesso!");
      setProfessores(false);
      setAlertOpen(true);
    } catch (error) {
      alert("Erro ao marcar aula.");
      console.log(error.response ? error.response.data : error.message);
      console.log({
        aluno: user._id,
        instrutor: instrutorSelecionado._id,
        dataIncio: data,
        dataFinal: data,
        UF: user.UF,
        localAula: localdeAula,
        statusAula: "Pendente",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;

      try {
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?.UF) return;

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) return;

    const fetchInstrutores = async () => {
      try {
        const response = await axios.get(
          "https://primeira-marcha-backend.vercel.app/instrutores",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const filtrados = response.data.filter(
          (instrutor) => instrutor.UF === user.UF,
        );

        setInstrutores(filtrados);
        console.log(filtrados);
      } catch (error) {
        console.error("Erro ao buscar instrutores:", error);
      }
    };

    fetchInstrutores();
  }, [user]);

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity="success">Aula reservada com sucesso!</Alert>
      </Snackbar>

      <MeuModal open={open} onClose={onClose}>
        <DialogTitle>Selecione um dia e horário para você!</DialogTitle>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            disablePast
            label="Dia & Horário"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
        <Button
          onClick={() => {
            setLocalizacao(true);
            setData(value?.toISOString());
          }}
          className="mt-2"
          variant="outlined"
          fullWidth
        >
          Proximo
        </Button>
      </MeuModal>

      <MeuModal open={localizacao} onClose={() => setLocalizacao(false)}>
        <DialogTitle>
          Escolha o endereço de sua preferencia para a aula.
        </DialogTitle>
        <TextField
          label="Endereço"
          fullWidth
          value={localdeAula}
          onChange={(e) => setLocaldeAula(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setProfessores(true);
            setLocalizacao(false);
          }}
        >
          Procurar um professor
        </Button>
      </MeuModal>

      <MeuModal open={professores} onClose={() => setProfessores(false)}>
        <DialogTitle>Escolha um professor para a aula.</DialogTitle>
        <List>
          {instrutores.map((instrutor) => (
            <ListItemButton
              key={instrutor.id}
              // Se o ID for igual ao selecionado, ele aplica o estilo de destaque do MUI
              selected={instrutorSelecionado?.id === instrutor.id}
              onClick={() => setInstrutorSelecionado(instrutor)}
              sx={{
                // Opcional: Customizar a cor quando selecionado
                "&.Mui-selected": {
                  backgroundColor: "rgba(25, 118, 210, 0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.24)",
                  },
                },
              }}
            >
              <ListItemText primary={instrutor.nome} /> - {instrutor.valorAula}{" "}
              R$
            </ListItemButton>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            marcarAula();
          }}
        >
          {loading ? <CircularProgress size={20} /> : "Marcar aula"}
        </Button>
      </MeuModal>
    </>
  );
}

export default MarcarAula;
