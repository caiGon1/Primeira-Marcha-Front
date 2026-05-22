import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react";
import "@fontsource/inter";
import {
  Button,
  List,
  ListItem,
  Avatar,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Assignment, Logout, Check, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import Profile from "../components/Profile";
import axios from "axios";

function DashboardInstrutor() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [aulasAgendadas, setAulasAgendadas] = React.useState([]);
  const [loadingRejeitar, setLoadingRejeitar] = useState(false);
  const [loadingAceitar, setLoadingAceitar] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const statusColors = {
    pendente: "text-orange-500",
    recusada: "text-red-600",
    cancelada: "text-black",
    agendada: "text-green-600",
    reagendada: "text-blue-600",
  };

  const [filtroAtivo, setFiltroAtivo] = useState("pendentes");

  const pendentes = aulasAgendadas.filter(
    (aula) =>
      aula.statusAula === "pendente" || aula.statusAula === "reagendada",
  );

  const aceitas = aulasAgendadas.filter(
    (aula) => aula.statusAula === "agendada",
  );

  const rejeitadas = aulasAgendadas.filter(
    (aula) => aula.statusAula === "recusada" || aula.statusAula === "cancelada",
  );

  const listaExibicao =
    filtroAtivo === "pendentes"
      ? pendentes
      : filtroAtivo === "aceitas"
        ? aceitas
        : rejeitadas;

  useEffect(() => {
    const fetchAulasComAluno = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      if (!token || !id) return;

      try {
        setSkeletonLoading(true);

        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aulas/instrutor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const aulas = res.data;

        const aulasComAluno = await Promise.all(
          aulas.map(async (aula) => {
            try {
              const alunoRes = await axios.get(
                `https://primeira-marcha-backend.vercel.app/aluno/${aula.aluno}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
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
      } finally {
        setSkeletonLoading(false);
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    } finally {
      setLoadingRejeitar(false);
      window.location.reload();
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    } finally {
      setLoadingAceitar(false);
      window.location.reload();
    }
  };

  const DashboardInstrutor = (
 <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo="instrutor"
      />

      <div className="flex h-screen bg-white font-['Inter'] overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#FFFCF0] border-r border-gray-100 flex-col p-6 justify-between shrink-0 h-full">
          <div>
            <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
              <img src="img/pmlogo.png" alt="Logo" />
            </div>

            <nav className="space-y-4">
              <button className="hover:cursor-pointer flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 rounded-l-full font-semibold border-l-4 border-yellow-500">
                <Assignment /> Aulas
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
          </div>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
          {/* Header */}
          <div className="flex flex-col md:flex-row p-6 md:p-10 justify-between items-start md:items-center gap-4">
            <div className="pb-2 md:pb-4">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Painel do Instrutor
              </h1>

              <p className="text-sm md:text-xl text-gray-600 mt-1 md:mt-2">
                Gerencie suas aulas pendentes e agendadas
              </p>
            </div>

            <Avatar
              className="hover:cursor-pointer self-end md:self-auto"
              onClick={() => setPerfilOpen(true)}
              sx={{ width: 50, height: 50 }}
            />
          </div>

          {/* Filtros */}
          <nav className="flex justify-start md:justify-center mb-6 md:mb-8 px-4 md:px-0 overflow-x-auto">
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm min-w-max">
              <button
                className={`hover:cursor-pointer px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  filtroAtivo === "pendentes"
                    ? "bg-yellow-100 text-yellow-700 shadow-sm border border-yellow-200"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setFiltroAtivo("pendentes")}
              >
                <Assignment />
                Pendentes/Reagendadas
              </button>

              <button
                className={`hover:cursor-pointer px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  filtroAtivo === "aceitas"
                    ? "bg-green-100 text-green-700 shadow-sm border border-green-200"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setFiltroAtivo("aceitas")}
              >
                <Check />
                Aceitas
              </button>

              <button
                className={`hover:cursor-pointer px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  filtroAtivo === "rejeitadas"
                    ? "bg-red-100 text-red-700 shadow-sm border border-red-200"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setFiltroAtivo("rejeitadas")}
              >
                <Delete />
                Rejeitadas/Canceladas
              </button>
            </div>
          </nav>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-20 flex flex-col items-center w-full">
            <List className="w-full max-w-3xl">
              {skeletonLoading ? (
                [1, 2, 3].map((n) => (
                  <Box
                    key={n}
                    className="w-full p-6 border border-gray-100 rounded-3xl mb-5 bg-white shadow-sm"
                  >
                    <Skeleton
                      variant="circular"
                      width={70}
                      height={70}
                      className="mb-4"
                    />

                    <Skeleton variant="text" width={180} height={35} />
                    <Skeleton variant="text" width={120} height={25} />

                    <div className="mt-6 space-y-2">
                      <Skeleton variant="text" width="60%" height={25} />
                      <Skeleton variant="text" width="40%" height={25} />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Skeleton variant="rounded" width={120} height={45} />
                      <Skeleton variant="rounded" width={120} height={45} />
                    </div>
                  </Box>
                ))
              ) : listaExibicao.length === 0 ? (
                <div className="text-center py-20">
                  <h2 className="text-xl text-gray-400">
                    Nenhuma aula encontrada
                  </h2>
                </div>
              ) : (
                listaExibicao.map((aula, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box className="flex flex-col items-center w-full p-5 md:p-8 border border-gray-100 rounded-2xl md:rounded-3xl mb-5 bg-white shadow-sm hover:shadow-md transition-all text-center">
                      {/* Perfil */}
                      <div className="flex flex-col items-center mb-6">
                        <Avatar
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: 3,
                          }}
                        />

                        <div className="mt-3">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Aluno
                          </p>

                          <h3 className="font-bold text-2xl text-gray-900 mt-1">
                            {aula.nomeAluno}
                          </h3>

                          <p
                            className={`capitalize ${statusColors[aula.statusAula?.toLowerCase()]} font-bold`}
                          >
                            {aula.statusAula}
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-px bg-gray-100 mb-6" />

                      {/* Informações */}
                      <Stack>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-center mb-6 justify-center">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                              Data
                            </p>

                            <p className="font-bold text-lg text-gray-900 mt-1">
                              {dayjs(aula.dataInicio).format("DD/MM/YYYY")}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                              Horário
                            </p>

                            <p className="font-bold text-lg text-gray-900 mt-1">
                              {dayjs(aula.dataInicio).format("HH:mm")}
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Local
                          </p>

                          <p className="font-bold text-gray-800 mt-1">
                            {aula.localAula}
                          </p>
                        </div>
                      </Stack>

                      {/* Botões */}
                      {(aula.statusAula === "pendente" ||
                        aula.statusAula === "reagendada") && (
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full mt-2 justify-center">
                          <Button
                            color="error"
                            variant="outlined"
                            startIcon={<Delete />}
                            className="border-red-200! text-red-500! font-bold! rounded-xl! px-6! py-2!"
                            onClick={() => rejeitarAula(aula._id)}
                          >
                            {loadingRejeitar ? (
                              <CircularProgress size={20} />
                            ) : (
                              "Rejeitar"
                            )}
                          </Button>

                          <Button
                            color="success"
                            variant="contained"
                            startIcon={<Check />}
                            className="bg-green-600! font-bold! rounded-xl! px-6! py-2!"
                            onClick={() => aceitarAula(aula._id)}
                          >
                            {loadingAceitar ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Aceitar"
                            )}
                          </Button>
                        </div>
                      )}
                    </Box>
                  </motion.div>
                ))
              )}
            </List>
          </div>
        </main>

        {/* Navbar Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-3 z-50">
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

  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      { DashboardInstrutor }
    </motion.div>
  );
}

export default DashboardInstrutor;
