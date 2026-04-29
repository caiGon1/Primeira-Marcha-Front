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
  BrokenImage,
} from "@mui/icons-material";
import Profile from "../components/Profile";
import MarcarAula from "../components/MarcarAula";
import ReagendaAula from "../components/ReagendaAula";
import { useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";

function DashboardMarcar() {
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.4 }}
    >
    <div className="flex h-screen bg-white font-['Inter'] overflow-hidden">
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
            onClick={() => setMarcarAulaOpen(true)}
            className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 hover:cursor-pointer transition rounded-lg"
          >
            <CalendarMonth /> Agendar Aulas
          </button>
          <button
           onClick={() => { navigator("/dashboard-aulas") }}
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
              <main className="flex items-center justify-center flex-1">
                  <BrokenImage/>
            </main>

      {/* MENU MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-2 z-50">
        <button className="flex flex-col items-center text-gray-600 text-xs">
          <People /> Instrutores
        </button>
        <button onClick={() => setMarcarAulaOpen(true)} className="flex flex-col items-center text-gray-600 text-xs">
          <CalendarMonth /> Agendar
        </button>
          <button onClick={() => { navigator("/dashboard-aulas") }} className="flex flex-col items-center text-gray-600 text-xs">
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
      </div>
      </motion.div>
  );
}

export default DashboardMarcar;