import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as React from "react";
import "@fontsource/inter";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Delete,
  People,
  CalendarMonth,
  Assignment,
  Logout,
} from "@mui/icons-material";
import Profile from "../components/Profile";
import MarcarAula from "../components/MarcarAula";

import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ptBR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Autocomplete, TextField } from "@mui/material";
import MeuModal from "../components/MeuModal";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";

function DashboardMarcar() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = useState(false); // Modal para exibir perfil do usuário
  const [marcarAulaOpen, setMarcarAulaOpen] = useState(false); // Modal para marcar aula
  const [carrinhoOpen, setCarrinhoOpen] = useState(false); // Modal para confirmar agendamento
  const [instrutores, setInstrutores] = useState([]); // Lista de instrutores
  const [exibirLimite, setExibirLimite] = useState(6); // Quantidade inicial de instrutores a exibir
  const [skeletonLoading, setSkeletonLoading] = useState(true); // Estado para controlar o carregamento dos skeletons
  const [user, setUser] = React.useState({}); // Dados do usuário
  const [dataSelecionada, setDataSelecionada] = useState(dayjs()); // Data atual como padrão
  const [instrutorSelecionado, setInstrutorSelecionado] = useState(null); //Instrutor ID
  const [instrutorSelecao, setInstrutorSelecao] = useState(false); //Flag para indicar se um instrutor foi selecionado
  const [selecionado, setSelecionado] = useState(false); // Flag para indicar se uma data foi selecionada
  const [horario, setHorario] = useState(null); // Horário selecionado
  const [localDaAula, setLocalDaAula] = useState(""); // Local da aula
  const [escolhaLocal, setEscolhaLocal] = useState(false); // Modal para escolher local da aula
  const [horarioSelecionado, setHorarioSelecionado] = useState(false); // Flag para indicar se um horário foi selecionado
  const [loading, setLoading] = useState(false); // Flag para indicar se a requisição de marcação de aula está em andamento
  const [sugestoes, setSugestoes] = useState([]);
  const [loadingBusca, setLoadingBusca] = useState(false);

  const colunas = [[], [], []];

  const buscarEndereco = async (query) => {
  if (query.length < 3) {
    setSugestoes([]);
    return;
  }

  setLoadingBusca(true);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=br&format=json&limit=5`;

    const response = await axios.get(url, {
      headers: {
        "Accept-Language": "pt-BR",
      },
    });

    if (Array.isArray(response.data)) {
      setSugestoes(response.data);
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
  } finally {
    setLoadingBusca(false);
  }
  };
  
  const handleDateChange = (newDate) => {
    if (!newDate) return;
    const updated = dataSelecionada
      .year(newDate.year())
      .month(newDate.month())
      .date(newDate.date());

    setDataSelecionada(updated);
    setSelecionado(true);
  };

  const handleTimeChange = (newTime) => {
    if (!newTime) return;
    const updated = dataSelecionada
      .hour(newTime.hour())
      .minute(newTime.minute());

    setDataSelecionada(updated);
    setHorarioSelecionado(true);
    console.log(dataSelecionada);
  };

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
        console.log(response.data);
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

  const marcarAula = async (e) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) return;
    try {
      setLoading(true);
      await axios.post(
        "https://primeira-marcha-backend.vercel.app/aula",
        {
          aluno: user._id,
          instrutor: instrutorSelecionado,
          dataInicio: dataSelecionada,
          dataFinal: dataSelecionada,
          UF: user.UF,
          localAula: localDaAula,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Aula marcada com sucesso!");
    } catch (error) {
      alert("Erro ao marcar aula.");
      console.log(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <MeuModal open={escolhaLocal} onClose={() => setEscolhaLocal(false)}>
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-lg font-bold">
            Digite um endereço para sua aula
          </h1>

          <Autocomplete
            fullWidth
            options={sugestoes}
            loading={loadingBusca}
            // Importante: extrair o nome correto do objeto da API
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.display_name || ""
            }
            // Impede que o MUI esconda opções que a API retornou
            filterOptions={(x) => x}
            // Texto exibido quando não há resultados ou está carregando
            noOptionsText="Nenhum endereço encontrado"
            loadingText="Buscando..."
            onInputChange={(event, newInputValue) => {
              buscarEndereco(newInputValue);
            }}
            onChange={(event, newValue) => {
              // Salva o endereço completo selecionado
              setLocalDaAula(newValue ? newValue.display_name : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Endereço da Aula"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingBusca ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            disabled={!localDaAula || loading}
            onClick={() => marcarAula()}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </MeuModal>

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

        <aside className="hidden md:flex w-64 bg-[#FFFCF0] border-r border-gray-100 flex-col p-6 justify-between shrink-0 h-full z-30">
          <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
            <img src="img/pmlogo.png" alt="Logo" />
          </div>
          <nav className="space-y-4">
            <button
              onClick={() => {
                navigator("/dashboard");
              }}
              className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 hover:cursor-pointer transition rounded-lg"
            >
              <People /> Instrutores
            </button>
            <button className="hover:cursor-pointer flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 rounded-l-full font-semibold border-l-4 border-yellow-500">
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

        <main className="flex-1 flex relative bg-white overflow-hidden h-full">
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: selecionado ? "0%" : "-100%",
              opacity: selecionado ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
            className="flex-1 h-full relative overflow-y-auto z-10"
          >
            <div className="relative min-h-full w-full">
              <div className="absolute inset-0 w-full justify-between pointer-events-none z-0 flex">
                {[0, 1, 2].map((_, i) => (
                  <div key={i} className="w-1/3 flex justify-center">
                    <div className="w-16 h-full bg-[#4A4A4A] flex justify-center border-x-4 border-gray-600">
                      <div className="w-1 h-full border-l-2 border-dashed border-yellow-400 opacity-80"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`relative z-10 p-10`}>
                <header className="flex justify-between items-center mb-10">
                  <Avatar
                    onClick={() => setPerfilOpen(true)}
                    sx={{ width: 56, height: 56, cursor: "pointer" }}
                  />
                </header>

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
                              <Skeleton
                                variant="rounded"
                                width="100%"
                                height={35}
                                className="mt-4"
                              />
                            </div>
                          ))
                        : colunas[laneIndex].map((instrutor) => {
                            const isSelected =
                              instrutorSelecionado === instrutor._id;

                            return (
                              <div
                                key={instrutor._id}
                                className={`bg-white rounded-2xl shadow-xl w-52 overflow-hidden transform transition duration-300 hover:-translate-y-1 z-10 border-4 ${
                                  isSelected
                                    ? "border-green-500 scale-105 shadow-2xl"
                                    : "border-transparent"
                                }`}
                              >
                                <div
                                  className={`${
                                    isSelected
                                      ? "bg-green-100"
                                      : laneIndex === 1
                                        ? "bg-sky-200"
                                        : "bg-orange-300"
                                  } h-20 flex justify-center pt-4 transition-colors`}
                                >
                                  <Avatar
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      border: isSelected
                                        ? "3px solid #22c55e"
                                        : "3px solid white",
                                    }}
                                  />
                                </div>
                                <div className="p-5 text-center">
                                  <h3
                                    className={`text-xs font-bold uppercase ${
                                      isSelected
                                        ? "text-green-600"
                                        : laneIndex === 1
                                          ? "text-sky-500"
                                          : "text-orange-500"
                                    }`}
                                  >
                                    {instrutor.nome}
                                  </h3>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {instrutor.cidade} <br /> {instrutor.UF}
                                  </p>
                                  <p className="text-[15px] font-bold text-gray-700 mt-2">
                                    {instrutor.valorAula}R$
                                  </p>
                                  <button
                                    onClick={() => {
                                      setInstrutorSelecionado(instrutor._id);
                                      setInstrutorSelecao(true); // Variável que libera o campo de horários
                                    }}
                                    className={`mt-4 w-full py-2 text-white rounded-full text-[10px] font-bold shadow-md hover:cursor-pointer transition-colors ${
                                      isSelected
                                        ? "bg-green-500"
                                        : laneIndex === 1
                                          ? "bg-sky-400"
                                          : "bg-orange-400"
                                    }`}
                                  >
                                    {isSelected
                                      ? "Selecionado ✓"
                                      : "Selecionar"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  ))}
                </div>

                {exibirLimite < instrutores.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setExibirLimite((prev) => prev + 6)}
                      className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 hover:cursor-pointer transition shadow-md text-xs relative z-10"
                    >
                      Ver mais instrutores
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            layout
            className={`flex items-center justify-center p-6 z-20 transition-all duration-500 ${
              selecionado
                ? "w-[440px] relative"
                : "absolute inset-0 w-full h-full bg-gray-50/30"
            }`}
          >
            <motion.div
              layout
              className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-2xl w-full max-w-sm flex flex-col justify-between min-h-[460px]"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-800 mb-2">
                    Calendário
                  </h2>
                  <div className="overflow-hidden">
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="pt-br"
                    >
                      <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-lg shadow">
                        {/* Calendário de Data */}
                        <DateCalendar
                          value={dataSelecionada}
                          onChange={handleDateChange}
                        />

                        {/* Seletor de Horário - Só aparece após selecionar a data */}
                        {selecionado && instrutorSelecao && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <TimePicker
                              label="Selecione o Horário"
                              value={dataSelecionada}
                              onChange={handleTimeChange}
                              ampm={false} // Formato 24h
                              slotProps={{ textField: { fullWidth: true } }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </LocalizationProvider>
                  </div>
                </div>

                {/* Controles de horário */}
                {selecionado && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 pt-4 border-t border-gray-100 flex items-middle justify-between"
                  >
                    <button
                      onClick={() => {
                        if (
                          !selecionado ||
                          !instrutorSelecao ||
                          !horarioSelecionado
                        ) {
                          alert(
                            "Por favor, selecione um instrutor, data e horário para prosseguir.",
                          );
                        } else {
                          setEscolhaLocal(true);
                        }
                      }}
                      className={`px-6 py-2 rounded-full text-white font-bold shadow-md hover:scale-105 transition active:scale-95 ${instrutorSelecao ? "bg-[#4A90E2]" : "bg-gray-400 cursor-not-allowed"}`}
                      className={`bg-[#EAA15F] p-3.5 rounded-2xl shadow-lg text-white hover:scale-105 transition active:scale-95 cursor-pointer`}
                    >
                      Prosseguir
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* 📱 MENU MOBILE */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-2 z-50">
          <button className="flex flex-col items-center text-gray-600 text-xs">
            <People /> Instrutores
          </button>
          <button
            onClick={() => setMarcarAulaOpen(true)}
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
      </div>
    </motion.div>
  );
}

export default DashboardMarcar;
