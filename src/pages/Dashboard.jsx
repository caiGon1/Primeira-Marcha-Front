import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import { Button, DialogTitle, List, ListItem } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";
import Profile from "../components/Profile";
import MarcarAula from "../components/MarcarAula";
import { useEffect } from "react";

function Dashboard() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [marcarAulaOpen, setMarcarAulaOpen] = React.useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = React.useState(false);
  const [aulas, setAulas] = React.useState([]);
  const [reserva, setReserva] = React.useState([]);

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
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAulasComInstrutor = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;

      try {
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aulas/aluno/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const aulas = res.data;

        const aulasComInstrutor = await Promise.all(
          aulas.map(async (aula) => {
            try {
              const instrutorRes = await axios.get(
                `https://primeira-marcha-backend.vercel.app/instrutor/${aula.instrutor}`,
                 { headers: { Authorization: `Bearer ${token}` } },
              );

              return {
                ...aula,
                nomeInstrutor: instrutorRes.data.nome,
                valorInstrutor: instrutorRes.data.valorAula,
              };
            } catch {
              return {
                ...aula,
                nomeInstrutor: "Instrutor Desconhecido",
                valorInstrutor: "N/A",
              };
            }
          }),
        );

        setAulas(aulasComInstrutor);
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
      }
    };

    fetchAulasComInstrutor();
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <Profile open={perfilOpen} onClose={() => setPerfilOpen(false)} />

      <MarcarAula
        open={marcarAulaOpen}
        onClose={() => setMarcarAulaOpen(false)}
      />

      <MeuModal open={carrinhoOpen} onClose={() => setCarrinhoOpen(false)}>
        <DialogTitle>Seu Carrinho</DialogTitle>
        <List>
          {reserva.length === 0 ? (
            <p className="p-4 text-center">Seu carrinho está vazio</p>
          ) : (
            reserva.map((item, index) => (
              <ListItem key={index} sx={{ gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  {item.professor} - R$ {item.preco}
                </Box>
                <Button
                  color="error"
                  onClick={() => {
                    setReserva(reserva.filter((_, i) => i !== index));
                  }}
                >
                  <Delete />
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setAulas(
                      aulas.map((a) =>
                        a.professor === item.professor
                          ? { ...a, reservada: false }
                          : a,
                      ),
                    );
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


      <header className="flex gap-3 justify-center border-b pb-4">
        <Button onClick={() => navigator("/")}>Logout</Button>
        <Button onClick={() => setPerfilOpen(true)}>Perfil</Button>
      </header>

      <Box className="flex flex-col md:flex-row gap-10 justify-center p-3">
        <Box className="border rounded-lg p-4 min-w-75">
          <h2 className="text-xl font-bold mb-4 text-center">Próximas Aulas</h2>
          <List className="flex flex-col gap-2">
            {aulas.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma aula agendada</p>
            ) : (
              aulas.map((aula, index) => (
                <ListItem
                  key={index}
                  className="border-b flex justify-between gap-4"
                >
                  <Stack>
                    <strong>{`${aula.nomeInstrutor} - ${aula.valorInstrutor}R$`}</strong>
                    <span className="text-sm">
                      {dayjs(aula.dataInicio).format("DD/MM/YYYY HH:mm")}
                    </span>
                    <span>{aula.localAula}</span>
                    <span className="text-sm">
                      {aula.statusAula === "pendente" ? "Pendente" : aula.statusAula === "confirmada" ? "Confirmada" : "N/A"}
                    </span>
                  </Stack>
                </ListItem>
              ))
            )}
          </List>
        </Box>
        

        <Stack direction="column" gap={2} justifyContent="center">
          <Button
            onClick={() => setMarcarAulaOpen(true)}
            variant="outlined"
            size="large"
          >
            Agendar uma aula
          </Button>
          <Button
            onClick={() => setCarrinhoOpen(true)}
            variant="outlined"
            color="secondary"
          >
            Ver Carrinho ({reserva.length})
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default Dashboard;
