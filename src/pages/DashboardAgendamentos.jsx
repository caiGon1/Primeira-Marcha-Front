import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as React from "react";
import "@fontsource/inter";
import {
  Button,
  List,
  Avatar,
  Skeleton,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  People,
  CalendarMonth,
  Assignment,
  Logout,
  Delete,
  Check,
  Edit,
  DeleteForever,
} from "@mui/icons-material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { motion } from "framer-motion";
import Profile from "../components/Profile";
import MarcarAula from "../components/MarcarAula";
import ReagendaAula from "../components/ReagendaAula";
import { useEffect } from "react";
import { Stack } from "@mui/system";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

dayjs.locale("pt-br");

function DashboardAgendamentos() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [marcarAulaOpen, setMarcarAulaOpen] = React.useState(false);
  const [skeletonLoading, setSkeletonLoading] = React.useState(true);
  const [reagendamento, setReagendamento] = React.useState(false);
  const [idSelecionado, setIdSelecionado] = React.useState(null);

  const [aulas, setAulas] = React.useState([]);
  const [rejeitadas, setRejeitadas] = React.useState([]);
  const [agendada, setAgendada] = React.useState([]);
  const [pendentes, setPendentes] = React.useState([]);
  const [filtroAtivo, setFiltroAtivo] = React.useState("pendentes");
  const [loadingCancelar, setLoadingCancelar] = React.useState(false);

  const statusColors = {
    pendente: "text-orange-500",
    recusada: "text-red-600",
    cancelada: "text-black",
    agendada: "text-green-600",
    reagendada: "text-blue-600",
  };

  const cancelarAula = async (aulaId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoadingCancelar(true);
      await axios.patch(
        `https://primeira-marcha-backend.vercel.app/aula/${aulaId}/cancelar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    } finally {
      setLoadingCancelar(false);
      window.location.reload();
    }
  };

  const handleCancel = (aulaId) => {
    cancelarAula(aulaId);
  };

  useEffect(() => {
    const fetchAulas = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;
      try {
        setSkeletonLoading(true);
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aulas/aluno/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const dadosComInstrutor = await Promise.all(
          res.data.map(async (aula) => {
            try {
              const instrRes = await axios.get(
                `https://primeira-marcha-backend.vercel.app/instrutor/${aula.instrutor}`,
                { headers: { Authorization: `Bearer ${token}` } },
              );
              return { ...aula, nomeInstrutor: instrRes.data.nome };
            } catch {
              return { ...aula, nomeInstrutor: "Desconhecido" };
            }
          }),
        );

        setAulas(dadosComInstrutor);
        setRejeitadas(
          dadosComInstrutor.filter(
            (a) => a.statusAula === "recusada" || a.statusAula === "cancelada",
          ),
        );
        setAgendada(
          dadosComInstrutor.filter((a) => a.statusAula === "agendada"),
        );
        setPendentes(
          dadosComInstrutor.filter(
            (a) => a.statusAula === "pendente" || a.statusAula === "reagendada",
          ),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setSkeletonLoading(false);
      }
    };
    fetchAulas();
  }, []);

  const listaExibicao =
    filtroAtivo === "pendentes"
      ? pendentes
      : filtroAtivo === "agendada"
        ? agendada
        : rejeitadas;

  const DashboardAgendamentos = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ReagendaAula
        open={reagendamento}
        onClose={() => setReagendamento(false)}
        aulaId={idSelecionado}
      />
      <MarcarAula
        open={marcarAulaOpen}
        onClose={() => setMarcarAulaOpen(false)}
      />
      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo={"aluno"}
      />

      <div className="flex h-screen bg-white font-['Inter'] overflow-hidden">
        <aside className="hidden md:flex w-64 bg-[#FFFCF0] border-r border-gray-100 flex-col p-6 justify-between shrink-0 h-full">
          <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
            <img src="img/pmlogo.png" alt="Logo" />
          </div>
          <nav className="space-y-4">
            <button
              onClick={() => navigator("/dashboard")}
              className="hover:cursor-pointer flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <People /> Instrutores
            </button>
            <button
              onClick={() => navigator("/dashboard-marcar")}
              className="hover:cursor-pointer flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <CalendarMonth /> Agendar Aulas
            </button>
            <button className="hover:cursor-pointer flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 rounded-l-full font-semibold border-l-4 border-yellow-500">
              <Assignment /> Agendamentos
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigator("/");
              }}
              className="hover:cursor-pointer flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <Logout /> Sair
            </button>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
          <div className="flex flex-col md:flex-row p-6 md:p-10 justify-between items-start md:items-center gap-4">
            <div className="pb-2 md:pb-4">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Meus Agendamentos
              </h1>
              <p className="text-sm md:text-xl text-gray-600 mt-1 md:mt-2">
                Acompanhe, adie ou cancele suas aulas agendadas
              </p>
            </div>

            <Avatar
              className="hover:cursor-pointer self-end md:self-auto"
              onClick={() => setPerfilOpen(true)}
              sx={{ width: 48, height: 48, md: { width: 56, height: 56 } }}
            />
          </div>

          <nav className="flex justify-start md:justify-center mb-6 md:mb-8 px-4 md:px-0 overflow-x-auto">
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm min-w-max">
              <button
                className={`hover:cursor-pointer px-10 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${filtroAtivo === "pendentes" ? "bg-yellow-100 text-yellow-700 shadow-sm border border-yellow-200" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => setFiltroAtivo("pendentes")}
              >
                <CalendarMonth /> Pendentes ou Reagendados
              </button>
              <button
                className={`hover:cursor-pointer px-10 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${filtroAtivo === "agendada" ? "bg-green-100 text-green-700 shadow-sm border border-green-200" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => setFiltroAtivo("agendada")}
              >
                <Check /> Agendados
              </button>
              <button
                className={`hover:cursor-pointer px-10 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${filtroAtivo === "rejeitadas" ? "bg-red-100 text-red-700 shadow-sm border border-red-200" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => setFiltroAtivo("rejeitadas")}
              >
                <Delete /> Rejeitados ou Cancelados
              </button>
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-20 flex flex-col items-center w-full">
            <List className="w-full max-w-2xl">
              {skeletonLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  className="rounded-2xl"
                />
              ) : listaExibicao.length === 0 ? (
                <div className="text-center py-20">
                  <h2 className="text-xl text-gray-400">
                    Nenhum agendamento encontrado
                  </h2>
                </div>
              ) : (
                listaExibicao.map((aula) => (
                  <Box
                    key={aula.id}
                    className="flex flex-col items-center w-full p-5 md:p-8 border border-gray-100 rounded-2xl md:rounded-3xl mb-4 md:mb-5 bg-white shadow-sm hover:shadow-md transition-all text-center"
                  >
                    <div className="flex flex-col items-center mb-6">
                      <Avatar sx={{ width: 72, height: 72, borderRadius: 3 }} />
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                          Instrutor
                        </p>
                        <h3 className="font-bold text-2xl text-gray-900 mt-1">
                          {aula.nomeInstrutor}
                        </h3>
                        <p
                          className={`capitalize ${statusColors[aula.statusAula]} font-inter font-bold`}
                        >
                          {aula.statusAula}
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 mb-6" />
                    <Stack>
                      <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-center mb-6 justify-center">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Data
                          </p>
                          <p className="font-bold text-lg text-gray-900 mt-1">
                            {dayjs(aula.dataInicio).format(
                              "D [de] MMMM [de] YYYY",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Horário
                          </p>
                          <p className="font-bold text-lg text-gray-900 mt-1">
                            {dayjs(aula.dataInicio).format("HH:mm")} -{" "}
                            {dayjs(aula.dataInicio)
                              .add(1, "hour")
                              .format("HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                          {aula.localAula}
                        </p>
                      </div>
                    </Stack>

                    {aula.statusAula !== "recusada" &&
                      aula.statusAula !== "cancelada" && (
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full mt-2 justify-center">
                          <Button
                            variant="contained"
                            className="bg-[#FFF3E0]! text-orange-600! shadow-none! border! border-orange-100! font-bold! rounded-xl! px-4! md:px-6! py-2! hover:cursor-pointer"
                            startIcon={<Edit />}
                            onClick={() => {
                              setReagendamento(true);
                              setIdSelecionado(aula._id);
                            }}
                          >
                            Adiar aula
                          </Button>

                          <Button
                            onClick={() => {
                              handleCancel(aula._id);
                            }}
                            variant="outlined"
                            className="border-red-200! text-red-500! font-bold! rounded-xl! px-4! md:px-6! py-2! hover:bg-red-50! hover:cursor-pointer"
                            startIcon={<DeleteForever />}
                          >
                            {loadingCancelar ? (
                              <CircularProgress />
                            ) : (
                              "Cancelar aula"
                            )}
                          </Button>
                        </div>
                      )}
                    {aula.statusAula === "agendada" && (
                      <div className="flex flex-col items-center gap-2 mt-4">
                        <Button
                          color="success"
                          variant="contained"
                          startIcon={<Check />}
                        >
                          Pagar
                        </Button>
                      </div>
                    )}
                  </Box>
                ))
              )}
            </List>
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-3 z-50">
          <button
            onClick={() => navigator("/dashboard")}
            className="flex flex-col items-center text-gray-600 text-xs"
          >
            <People /> Instrutores
          </button>
          <button
            onClick={() => navigator("/dashboard-marcar")}
            className="flex flex-col items-center text-gray-600 text-xs"
          >
            <CalendarMonth /> Agendar
          </button>
          <button className="flex flex-col items-center text-gray-600 text-xs">
            <Assignment /> Aulas
          </button>
          <button
            onClick={() => {
              localStorage.clear();
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {DashboardAgendamentos};
    </motion.div>
  );
}

export default DashboardAgendamentos;
