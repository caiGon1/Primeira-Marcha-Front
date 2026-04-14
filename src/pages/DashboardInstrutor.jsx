import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react"; // Adicione useState aqui
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, DialogTitle, List, ListItem, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { NumericFormat } from "react-number-format";
import Profile from "../components/Profile";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function DashboardInstrutor() {
  const tomorrow = dayjs().add(1, "day");
  const navigator = useNavigate();
  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [value1, setValue1] = React.useState(dayjs(null));
  const [value2, setValue2] = React.useState(dayjs(null));
  const [value3, setValue3] = React.useState("");
  const [aulas, setAulas] = React.useState([]);
  const [aulasAgendadas, setAulasAgendadas] = React.useState([]);
  const [loadingRejeitar, setLoadingRejeitar] = useState(false);
  const [loadingAceitar, setLoadingAceitar] = useState(false);

  const statusColors = {
    pendente: "text-orange-500",
    recusada: "text-red-600",
    cancelada: "text-black",
    agendada: "text-green-600",
  };

  useEffect(() => {
    const fetchAulasComAluno = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;

      try {
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aulas/instrutor/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const aulas = res.data;

        const aulasComAluno = await Promise.all(
          aulas.map(async (aula) => {
            try {
              const alunoRes = await axios.get(
                `https://primeira-marcha-backend.vercel.app/aluno/${aula.aluno}`,
                { headers: { Authorization: `Bearer ${token}` } },
              );

              return {
                ...aula,
                nomeAluno: alunoRes.data.nome,
              };
            } catch {
              return {
                ...aula,
                nomeAluno: "Aluno Desconhecido",
              };
            }
          }),
        );

        setAulasAgendadas(aulasComAluno);
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
      }
    };

    fetchAulasComAluno();
  }, []);

  const rejeitarAula = async (aulaId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoadingRejeitar(true);
      await axios.patch(
        `https://primeira-marcha-backend.vercel.app/aula/${aulaId}/rejeitar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      alert("Erro ao rejeitar aula.");
      console.log(error.response ? error.response.data : error.message);
      console.log(token);
    } finally {
      setLoadingRejeitar(false);
    }
  };

  const aceitarAula = async (aulaId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoadingAceitar(true);
      await axios.patch(
        `https://primeira-marcha-backend.vercel.app/aula/${aulaId}/aceitar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      alert("Erro ao aceitar aula.");
      console.log(error.response ? error.response.data : error.message);
    } finally {
      setLoadingAceitar(false);
    }
  };

  const handleAccept = (aulaId) => {
    if (
      window.confirm(
        "Tem certeza que deseja aceitar esta aula? Essa ação não pode ser desfeita.",
      )
    ) {
      aceitarAula(aulaId);
    }
  };

  const handleReject = (aulaId) => {
    if (
      window.confirm(
        "Tem certeza que deseja rejeitar esta aula? Essa ação não pode ser desfeita.",
      )
    ) {
      rejeitarAula(aulaId);
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo="instrutor"
      />

      {/* Modal ajustado para ter espaçamento consistente */}
      <MeuModal open={horariosOpen} onClose={() => setHorariosOpen(false)}>
        <DialogTitle>Disponibilidade de Aula</DialogTitle>
        <Stack spacing={3} sx={{ p: 2 }}>
          <p className="text-gray-600">
            Selecione o intervalo de horário e o preço:
          </p>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Início"
              value={value1}
              onChange={(newValue) => setValue1(newValue)}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DateTimePicker
              label="Término"
              minDate={tomorrow}
              disablePast
              value={value2}
              onChange={(newValue) => setValue2(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <NumericFormat
            customInput={TextField}
            label="Preço por aula"
            variant="outlined"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values) => setValue3(values.floatValue)}
            fullWidth
          />

          <Button
            onClick={() => {
              setAulas([
                ...aulas,
                { dia1: value1, dia2: value2, preco: value3 },
              ]);
              setHorariosOpen(false);
            }}
            variant="contained"
            fullWidth
          >
            Criar disponibilidade
          </Button>
        </Stack>
      </MeuModal>

      {/* Header padronizado */}
      <header className="flex gap-3 justify-center border-b pb-4">
        <Button onClick={() => navigator("/")}>Logout</Button>
        <Button onClick={() => setPerfilOpen(true)}>Perfil</Button>
      </header>

      {/* Layout principal alinhado com o Dashboard do Aluno */}
      <Box className="flex flex-col md:flex-row gap-10 justify-center p-3">
        {/* Coluna de Listagem */}
        <Box className="border rounded-lg p-4 min-w-75">
          <h2 className="text-xl font-bold mb-4 text-center">
            Aulas agendadas
          </h2>
          <List className="flex flex-col gap-2">
            {aulasAgendadas.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma aula agendada</p>
            ) : (
              aulasAgendadas.map((aula, index) => (
                <ListItem
                  key={index}
                  className="border-b flex justify-between gap-4 items-center"
                >
                  <Stack>
                    <div>
                      <strong className="mr-2">{aula.nomeAluno}</strong>
                      <strong
                        className={`${statusColors[aula.statusAula]} capitalize`}
                      >
                        {aula.statusAula?.toLowerCase()}
                      </strong>
                    </div>
                    <span className="text-sm text-gray-600">
                      {dayjs(aula.dataInicio).format("DD/MM/YYYY HH:mm")}
                      <br />
                      {aula.localAula}
                    </span>
                  </Stack>
                  <Button color="error" onClick={() => handleReject(aula.id)}>
                    {loadingRejeitar ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Rejeitar"
                    )}
                  </Button>
                  <Button
                    color="success"
                    onClick={() => {
                      handleAccept(aula.id);
                    }}
                  >
                    {loadingAceitar ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Aceitar"
                    )}
                  </Button>
                  <Button>Reagendar</Button>
                </ListItem>
              ))
            )}
          </List>
        </Box>

        {/* Coluna de Ações (Botões Laterais) */}
        <Stack direction="column" gap={2} justifyContent="center">
          <Button
            onClick={() => setHorariosOpen(true)}
            variant="outlined"
            size="large"
          >
            Criar uma aula
          </Button>
          {/* Espaço para outros botões que o instrutor possa ter futuramente */}
        </Stack>
      </Box>
    </div>
  );
}

export default DashboardInstrutor;
