import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import { Button, DialogTitle, List, ListItem, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import {
  Delete,
  People,
  CalendarMonth,
  Assignment,
  Logout,
  Edit,
} from "@mui/icons-material";
import Profile from "../components/Profile";
import MarcarAula from "../components/MarcarAula";
import ReagendaAula from "../components/ReagendaAula";
import { useEffect } from "react";

function Dashboard() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [marcarAulaOpen, setMarcarAulaOpen] = React.useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = React.useState(false);
  const [aulas, setAulas] = React.useState([]);
  const [reserva, setReserva] = React.useState([]);
  const [instrutores, setInstrutores] = React.useState([]);
  const [scrollAtivo, setScrollAtivo] = React.useState(false);
  const [exibirLimite, setExibirLimite] = React.useState(6);

  const [reagendamento, setReagendamento] = React.useState(false);
  const [idSelecionado, setIdSelecionado] = React.useState(null);
  const [skeletonLoading, setSkeletonLoading] = React.useState(true);
  const [user, setUser] = React.useState({});
  const colunas = [[], [], []];

  useEffect(() => {
    const fetchAluno = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;
      try {
        const response = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aluno/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
      }
    };
    fetchAluno();
  }, []);

  useEffect(() => {
    if (!user || !user.UF) return;
    const fetchInstrutores = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://primeira-marcha-backend.vercel.app/instrutores",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const filtrados = response.data.filter(
          (instrutor) => instrutor.UF === user.UF,
        );
        setInstrutores(filtrados);
      } catch (error) {
        console.error("Erro ao buscar instrutores:", error);
      }
    };
    fetchInstrutores();
  }, [user]);

  instrutores.slice(0, exibirLimite).forEach((instrutor, index) => {
    colunas[index % 3].push(instrutor);
  });

  return (
    <div className="flex h-screen bg-white font-['Inter'] overflow-hidden">
      <aside className="w-64 bg-[#FFFCF0] border-r border-gray-100 flex flex-col p-6 justify-between shrink-0">
        <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
          <img src="img/pmlogo.png" alt="" />
        </div>
        <nav className="space-y-4">
          <button className="flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 rounded-l-full font-semibold border-l-4 border-yellow-500">
            <People /> Instrutores
          </button>
          <button
            onClick={() => setMarcarAulaOpen(true)}
            className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 transition rounded-lg"
          >
            <CalendarMonth /> Agendar Aulas
          </button>
          <button
            onClick={() => setCarrinhoOpen(true)}
            className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 transition rounded-lg"
          >
            <Assignment /> Agendamentos
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("id");
              navigator("/");
            }}
            className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 transition rounded-lg text-left"
          >
            <Logout /> Sair
          </button>
        </nav>
      </aside>

      <main
        className={`flex-1 relative p-10 bg-white ${scrollAtivo ? "overflow-y-auto" : ""}`}
      >
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            Instrutores disponíveis
          </h1>
          <div
            className="relative cursor-pointer"
            onClick={() => setPerfilOpen(true)}
          >
            <Avatar sx={{ width: 56, height: 56 }} />
          </div>
        </header>

        <div className="flex flex-col items-center">
          <div className="flex justify-around items-start pt-10 w-full">
            {[0, 1, 2].map((laneIndex) => (
              <div
                key={laneIndex}
                className="relative flex flex-col items-center gap-12 min-w-50 min-h-[600px]"
              >
                <div className="absolute top-0 w-16 h-screen bg-[#4A4A4A] z-0 flex justify-center shadow-2xl">
                  <div className="w-1 h-full border-l-2 border-dashed border-yellow-400 opacity-70"></div>
                </div>

                {colunas[laneIndex].map((instrutor) => (
                  <div
                    key={instrutor._id}
                    className="z-10 bg-white rounded-2xl shadow-xl w-52 overflow-hidden transform transition hover:-translate-y-1"
                  >
                    <div
                      className={`${
                        laneIndex === 1 ? "bg-sky-200" : "bg-orange-300"
                      } h-20 flex justify-center pt-4`}
                    >
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          border: "3px solid white",
                        }}
                      />
                    </div>

                    <div className="p-5 text-center">
                      <h3
                        className={`text-xs font-bold uppercase ${
                          laneIndex === 1 ? "text-sky-500" : "text-orange-500"
                        }`}
                      >
                        {instrutor.nome}
                      </h3>

                      <p className="text-[10px] text-gray-400 mt-1">
                        {instrutor.cidade}
                        <br />
                        {instrutor.UF}
                      </p>

                      <button
                        onClick={() => setMarcarAulaOpen(true)}
                        className={`mt-4 w-full py-2 ${
                          laneIndex === 1 ? "bg-sky-400" : "bg-orange-400"
                        } text-white rounded-full text-[10px] font-bold shadow-md`}
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {exibirLimite < instrutores.length && (
            <button
              onClick={() => {
                setExibirLimite((prev) => prev + 6);
                setScrollAtivo(true);
              }}
              className="relative z-10 mt-10 mb-20 px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 transition"
            >
              Ver mais instrutores
            </button>
          )}
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
        <MeuModal open={carrinhoOpen} onClose={() => setCarrinhoOpen(false)}>
          <DialogTitle>Seu Carrinho</DialogTitle>
        </MeuModal>
      </main>
    </div>
  );
}

export default Dashboard;
