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
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";

function Dashboard() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [marcarAulaOpen, setMarcarAulaOpen] = React.useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = React.useState(false);
  const [instrutores, setInstrutores] = React.useState([]);
  const [exibirLimite, setExibirLimite] = React.useState(6);
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
      setSkeletonLoading(true);
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
      } finally {
        setSkeletonLoading(false);
      }
    };
    fetchInstrutores();
  }, [user]);

  instrutores.slice(0, exibirLimite).forEach((instrutor, index) => {
    colunas[index % 3].push(instrutor);
  });

  const Dashboard = (<div className="flex h-screen bg-white font-['Inter'] overflow-hidden">
        <MarcarAula
          open={marcarAulaOpen}
          onClose={() => setMarcarAulaOpen(false)}
        />
        <Profile
          open={perfilOpen}
          onClose={() => setPerfilOpen(false)}
          tipo={"aluno"}
        />

        {/* ASIDE FIXO */}
        <aside className="hidden md:flex w-64 bg-[#FFFCF0] border-r border-gray-100 flex-col p-6 justify-between shrink-0 h-full">
          <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
            <img src="img/pmlogo.png" alt="Logo" />
          </div>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 hover:cursor-pointer rounded-l-full font-semibold border-l-4 border-yellow-500">
              <People /> Instrutores
            </button>
            <button
              onClick={() => navigator("/dashboard-marcar")}
              className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 hover:cursor-pointer transition rounded-lg"
            >
              <CalendarMonth /> Agendar Aulas
            </button>
            <button
              onClick={() => {
                navigator("/dashboard-aulas");
              }}
              className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 hover:cursor-pointer transition rounded-lg"
            >
              <Assignment /> Agendamentos
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                navigator("/");
              }}
              className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 hover:cursor-pointer transition rounded-lg text-left"
            >
              <Logout /> Sair
            </button>
          </nav>
        </aside>

        {/* MAIN COM SCROLL INDEPENDENTE */}
        <main className="flex-1 relative bg-white overflow-y-auto  md:pb-0">
          {/* CONTAINER DA ESTRADA QUE CRESCE COM O CONTEÚDO */}
          <div className="relative min-h-full w-full">
            {/* ESTRADA DESKTOP */}
            <div className="hidden md:flex absolute inset-0 w-full justify-between pointer-events-none z-0">
              {[0, 1, 2].map((_, i) => (
                <div key={i} className="w-1/3 flex justify-center">
                  <div className="w-16 h-full bg-[#4A4A4A] flex justify-center">
                    <div className="w-1 h-full border-l-2 border-dashed border-yellow-400 opacity-70"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* ESTRADA MOBILE */}
            <div className="md:hidden absolute inset-0 w-full flex justify-center pointer-events-none z-0">
              <div className="w-16 h-full bg-[#4A4A4A] flex justify-center">
                <div className="w-0 h-full border-l-2 border-dashed border-yellow-400 opacity-70"></div>
              </div>
            </div>

            {/* CONTEÚDO REAL */}
            <div className="relative z-10 p-10">
              <header className="flex justify-between items-center mb-10">
                <h1 className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                  Instrutores
                </h1>
                <div className="relative cursor-pointer">
                  <Avatar
                    onClick={() => setPerfilOpen(true)}
                    sx={{ width: 56, height: 56 }}
                  />
                </div>
              </header>

              <div className="flex flex-col items-center">
                <div className="flex flex-col md:flex-row w-full pt-10">
                  {[0, 1, 2].map((laneIndex) => (
                    <div
                      key={laneIndex}
                      className="w-full md:w-1/3 flex flex-col items-center gap-6 md:gap-12 mb-10 md:mb-0"
                    >
                      {skeletonLoading
                        ? Array.from({ length: 2 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-white rounded-2xl shadow-xl w-52 overflow-hidden p-5"
                            >
                              <Skeleton
                                variant="circular"
                                width={60}
                                height={60}
                                className="mx-auto"
                              />
                              <Skeleton
                                width="80%"
                                height={20}
                                className="mt-4 mx-auto"
                              />
                              <Skeleton
                                width="60%"
                                height={15}
                                className="mt-2 mx-auto"
                              />
                            </div>
                          ))
                        : colunas[laneIndex].map((instrutor) => (
                            <div
                              key={instrutor._id}
                              className="z-10 bg-white rounded-2xl shadow-xl w-52 overflow-hidden transform transition hover:-translate-y-1"
                            >
                              <div
                                className={`${laneIndex === 1 ? "bg-sky-200" : "bg-orange-300"} h-20 flex justify-center pt-4`}
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
                                  className={`text-xs font-bold uppercase ${laneIndex === 1 ? "text-sky-500" : "text-orange-500"}`}
                                >
                                  {instrutor.nome}
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {instrutor.cidade} <br /> {instrutor.UF}
                                </p>
                              </div>
                            </div>
                          ))}
                    </div>
                  ))}
                </div>

                {exibirLimite < instrutores.length && (
                  <button
                    onClick={() => setExibirLimite((prev) => prev + 6)}
                    className="relative z-10 mt-10 mb-20 px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 hover:cursor-pointer transition"
                  >
                    Ver mais instrutores
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* MENU MOBILE */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-2 z-50">
          <button className="flex flex-col items-center text-gray-600 text-xs">
            <People /> Instrutores
          </button>
          <button
            onClick={() => navigator("/dashboard-marcar")}
            className="flex flex-col items-center text-gray-600 text-xs"
          >
            <CalendarMonth /> Agendar
          </button>
          <button
            onClick={() => {
              navigator("/dashboard-aulas");
            }}
            className="flex flex-col items-center text-gray-600 text-xs"
          >
            <Assignment /> Aulas
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("id");
              navigator("/");
            }}
            className="flex flex-col items-center text-red-500 text-xs"
          >
            <Logout /> Sair
          </button>
        </div>
      </div>)

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {Dashboard}
    </motion.div>
  );
}

export default Dashboard;
