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
import { Button, DialogTitle, List, ListItem, Snackbar, Alert } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";
import Profile from "../components/Profile";

function Dashboard() {
  const navigator = useNavigate();

  const [openMenu, setMenuOpen] = React.useState(false);
  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [professorOpen, setProfessorOpen] = React.useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);


  const [value, setValue] = React.useState(dayjs());
  const [aulas, setAulas] = React.useState([]);
  const [reserva, setReserva] = React.useState([]);
  const [user, setUser] = React.useState({ nome: "Carregando..." });


  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;

      try {
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      }
    };
    fetchUser();
  }, []);

  const agendarAula = (professor, preco) => {
    setProfessorOpen(false);
    setAlertOpen(true);
    setAulas([...aulas, { professor, horario: value, reservada: true }]);
    setReserva([...reserva, { professor, preco }]);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      

      <Profile 
        open={perfilOpen} 
        onClose={() => setPerfilOpen(false)} 
      />


      <MeuModal open={horariosOpen} onClose={() => setHorariosOpen(false)}>
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
          onClick={() => { setHorariosOpen(false); setProfessorOpen(true); }}
          className="mt-2"
          variant="outlined"
          fullWidth
        >
          Procurar um professor
        </Button>
      </MeuModal>

   
      <MeuModal open={professorOpen} onClose={() => setProfessorOpen(false)}>
        <DialogTitle>Professores disponíveis</DialogTitle>
        <List>
          {[
            { id: 1, nome: "Professor 1", preco: 150 },
            { id: 2, nome: "Professor 2", preco: 200 },
            { id: 3, nome: "Professor 3", preco: 300 },
          ].map((prof) => (
            <ListItem key={prof.id} sx={{ justifyContent: 'space-between' }}>
              {prof.nome} - R$ {prof.preco}
              <Button onClick={() => agendarAula(prof.nome, prof.preco)}>
                Agendar
              </Button>
            </ListItem>
          ))}
        </List>
      </MeuModal>

      <MeuModal open={carrinhoOpen} onClose={() => setCarrinhoOpen(false)}>
        <DialogTitle>Seu Carrinho</DialogTitle>
        <List>
          {reserva.length === 0 ? (
            <p className="p-4 text-center">Seu carrinho está vazio</p>
          ) : (
            reserva.map((item, index) => (
              <ListItem key={index} sx={{ gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>{item.professor} - R$ {item.preco}</Box>
                <Button color="error" onClick={() => {
                  setReserva(reserva.filter((_, i) => i !== index));
                }}>
                  <Delete />
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Atualiza a aula correspondente para "Paga" (reservada: false)
                    setAulas(aulas.map(a => a.professor === item.professor ? { ...a, reservada: false } : a));
                    setReserva(reserva.filter((_, i) => i !== index));
                    setCarrinhoOpen(false);
                  }}
                >
                  Pagar
                </Button>
              </ListItem>
            ))
          )}
        </List>
      </MeuModal>

      <Snackbar open={alertOpen} autoHideDuration={5000} onClose={() => setAlertOpen(false)}>
        <Alert severity="success" action={
          <Button color="inherit" size="small" onClick={() => {setCarrinhoOpen(true); setAlertOpen(false);}}>
            CARRINHO
          </Button>
        }>
          Aula reservada com sucesso!
        </Alert>
      </Snackbar>

      <MeuDrawer openMenu={openMenu} setOpenMenu={setMenuOpen} />

      <header className="flex gap-3 justify-center border-b pb-4">
        <Button onClick={() => navigator("/")}>Logout</Button>
        <Button onClick={() => setPerfilOpen(true)}>Perfil</Button>
        <Button onClick={() => setMenuOpen(true)}>Chat</Button>
      </header>

      <Box className="flex flex-col md:flex-row gap-10 justify-center p-3">
        <Box className="border rounded-lg p-4 min-w-[300px]">
          <h2 className="text-xl font-bold mb-4 text-center">Próximas Aulas</h2>
          <List className="flex flex-col gap-2">
            {aulas.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma aula agendada</p>
            ) : (
              aulas.map((aula, index) => (
                <ListItem key={index} className="border-b flex justify-between gap-4">
                  <Stack>
                    <strong>{aula.professor}</strong>
                    <span className="text-sm">{aula.horario.format("DD/MM/YYYY HH:mm")}</span>
                    <span className={`text-xs ${aula.reservada ? 'text-orange-500' : 'text-green-500'}`}>
                      {aula.reservada ? "Aguardando Pagamento" : "Confirmada (Paga)"}
                    </span>
                  </Stack>
                  <Button color="error" onClick={() => setAulas(aulas.filter((_, i) => i !== index))}>
                    <Delete />
                  </Button>
                </ListItem>
              ))
            )}
          </List>
        </Box>

        <Stack direction="column" gap={2} justifyContent="center">
          <Button onClick={() => setHorariosOpen(true)} variant="outlined" size="large">
            Agendar uma aula
          </Button>
          <Button onClick={() => setCarrinhoOpen(true)} variant="outlined" color="secondary">
            Ver Carrinho ({reserva.length})
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default Dashboard;