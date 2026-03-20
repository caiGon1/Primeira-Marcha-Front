import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import MeuDrawer from "../components/MeuDrawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, DialogTitle, List, ListItem } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";

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

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <MeuModal open={perfilOpen} onClose={() => setPerfilOpen(false)}>
        <p>Este é o conteúdo do modal.</p>
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
        <ul>
          <li>
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
          </li>
          <li>
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
          </li>
          <li>
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
          </li>
        </ul>
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
