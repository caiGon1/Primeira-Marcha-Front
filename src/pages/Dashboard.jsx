import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import { Button, DialogTitle, List, ListItem, Avatar } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Delete, People, CalendarMonth, Assignment, Logout, Edit } from "@mui/icons-material";
import Profile from "../components/Profile";
import MarcarAula from "../components/MarcarAula";
import ReagendaAula from "../components/ReagendaAula";
import { useEffect } from "react";
import { Skeleton } from "@mui/material";

function Dashboard() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [marcarAulaOpen, setMarcarAulaOpen] = React.useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = React.useState(false);
  const [aulas, setAulas] = React.useState([]);
  const [reserva, setReserva] = React.useState([]);
  const [reagendamento, setReagendamento] = React.useState(false);
  const [idSelecionado, setIdSelecionado] = React.useState(null);
  const [skeletonLoading, setSkeletonLoading] = React.useState(true);

  const statusColors = {
    pendente: "text-orange-500",
    recusada: "text-red-600",
    cancelada: "text-black",
    agendada: "text-green-600",
    reagendada: "text-blue-600",
  };

  useEffect(() => {
    const fetchAulasComInstrutor = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;

      try {
        setSkeletonLoading(true);
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aulas/aluno/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const aulasData = res.data;

        const aulasComInstrutor = await Promise.all(
          aulasData.map(async (aula) => {
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
      } finally {
        setSkeletonLoading(false);
      }
    };

    fetchAulasComInstrutor();
  }, []);

  return (
    <div className="flex h-screen bg-white font-['Inter'] overflow-hidden">
      <aside className="w-64 bg-[#FFFCF0] border-r border-gray-100 flex flex-col p-6 justify-between shrink-0">
        <div>
          <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
            PRIMEIRA <br/> MARCHA
          </div>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 rounded-l-full font-semibold border-l-4 border-yellow-500">
              <People /> Instrutores
            </button>
            <button onClick={() => setMarcarAulaOpen(true)} className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 transition rounded-lg">
              <CalendarMonth /> Agendar Aulas
            </button>
            <button onClick={() => setCarrinhoOpen(true)} className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 transition rounded-lg">
              <Assignment /> Agendamentos
            </button>
            <button onClick={() => navigator("/")} className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 transition rounded-lg text-left">
              <Logout /> Sair
            </button>
          </nav>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 mb-2">Desbloquear Recursos Premium Apenas R$12,90 Mensalmente</p>
          <button className="w-full py-2 bg-[#FFD54F] text-white rounded-lg font-bold text-sm shadow-md">Go Premium</button>
        </div>
      </aside>

      <main className="flex-1 relative overflow-y-auto p-10 bg-white">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-gray-400 font-bold uppercase tracking-widest text-sm">Tela de Instrutores</h1>
          <div className="relative cursor-pointer" onClick={() => setPerfilOpen(true)}>
            <Avatar sx={{ width: 56, height: 56 }} />
            <div className="absolute bottom-0 right-0 bg-orange-500 p-1 rounded-full text-white scale-75 border-2 border-white">
              <Edit style={{ fontSize: 16 }} />
            </div>
          </div>
        </header>

        <div className="flex justify-around items-start pt-10 min-h-[600px]">
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="relative flex flex-col items-center gap-12 min-w-[200px]">
              <div className="absolute top-[-200px] w-16 h-[2000px] bg-[#4A4A4A] z-0 flex justify-center shadow-2xl">
                <div className="w-1 h-full border-l-2 border-dashed border-yellow-400 opacity-70"></div>
              </div>

              {/* Exemplo de Card baseado na imagem */}
              <div className="z-10 bg-white rounded-2xl shadow-xl w-52 overflow-hidden transform transition hover:-translate-y-1">
                <div className={`${lane === 1 ? 'bg-sky-200' : 'bg-orange-300'} h-20 flex justify-center pt-4`}>
                   <Avatar sx={{ width: 60, height: 60, border: '3px solid white' }} />
                </div>
                <div className="p-5 text-center">
                  <h3 className={`text-xs font-bold uppercase ${lane === 1 ? 'text-sky-500' : 'text-orange-500'}`}>KAIQUE SOUSA</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Zona Norte<br/>Freguesia do Ó</p>
                  <button onClick={() => setMarcarAulaOpen(true)} className={`mt-4 w-full py-2 ${lane === 1 ? 'bg-sky-400' : 'bg-orange-400'} text-white rounded-full text-[10px] font-bold shadow-md`}>
                    Agendar
                  </button>
                </div>
              </div>

              <div className="z-10 bg-white rounded-2xl shadow-xl w-52 overflow-hidden transform transition hover:-translate-y-1">
                <div className={`${lane === 1 ? 'bg-sky-100' : 'bg-pink-300'} h-20 flex justify-center pt-4`}>
                   <Avatar sx={{ width: 60, height: 60, border: '3px solid white' }} />
                </div>
                <div className="p-5 text-center">
                  <h3 className={`text-xs font-bold uppercase ${lane === 1 ? 'text-sky-400' : 'text-pink-500'}`}>CARLOS</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Zona Norte<br/>Bom Retiro</p>
                  <button onClick={() => setMarcarAulaOpen(true)} className={`mt-4 w-full py-2 ${lane === 1 ? 'bg-sky-400' : 'bg-pink-400'} text-white rounded-full text-[10px] font-bold shadow-md`}>
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Profile
          open={perfilOpen}
          onClose={() => setPerfilOpen(false)}
          tipo="aluno"
        />

        <MarcarAula
          open={marcarAulaOpen}
          onClose={() => setMarcarAulaOpen(false)}
        />

        <ReagendaAula
          open={reagendamento}
          onClose={() => setReagendamento(false)}
          aulaId={idSelecionado}
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
      </main>
    </div>
  );
}

export default Dashboard;