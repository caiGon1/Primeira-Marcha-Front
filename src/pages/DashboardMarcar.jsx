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
  ArrowBack,
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
import { motion, AnimatePresence } from "framer-motion";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Autocomplete, TextField } from "@mui/material";
import MeuModal from "../components/MeuModal";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";

function DashboardMarcar() {
  const navigator = useNavigate();

  const [perfilOpen, setPerfilOpen] = useState(false);
  const [marcarAulaOpen, setMarcarAulaOpen] = useState(false);
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [instrutores, setInstrutores] = useState([]);
  const [exibirLimite, setExibirLimite] = useState(6);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [user, setUser] = React.useState({});
  const [dataSelecionada, setDataSelecionada] = useState(dayjs());
  const [instrutorSelecionado, setInstrutorSelecionado] = useState(null);
  const [instrutorSelecao, setInstrutorSelecao] = useState(false);
  const [selecionado, setSelecionado] = useState(false);
  const [horario, setHorario] = useState(null);
  const [localDaAula, setLocalDaAula] = useState("");
  const [escolhaLocal, setEscolhaLocal] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [inputEndereco, setInputEndereco] = useState("");

  const [mobileStep, setMobileStep] = useState(0);

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
        headers: { "Accept-Language": "pt-BR" },
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

  const marcarAula = async () => {
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

  const stepLabels = ["Data", "Instrutor", "Horário", "Endereço"];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };
  const [slideDirection, setSlideDirection] = useState(1);

  const goToStep = (next) => {
    setSlideDirection(next > mobileStep ? 1 : -1);
    setMobileStep(next);
  };

  // ─────────────────────────────────────────────
  // DESKTOP
  // ─────────────────────────────────────────────
  const desktopLayout = (
    <div className="hidden md:flex h-screen bg-white font-['Inter'] overflow-hidden">
      <MeuModal open={escolhaLocal} onClose={() => setEscolhaLocal(false)}>
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-lg font-bold">
            Digite um endereço para sua aula
          </h1>
          <Autocomplete
            fullWidth
            options={sugestoes}
            loading={loadingBusca}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.display_name || ""
            }
            filterOptions={(x) => x}
            noOptionsText="Nenhum endereço encontrado"
            loadingText="Buscando..."
            onInputChange={(event, newInputValue) => {
              setInputEndereco(newInputValue);
              setLocalDaAula(newInputValue);
              buscarEndereco(newInputValue);
            }}
            onChange={(event, newValue) => {
              const val = newValue ? newValue.display_name : inputEndereco;
              setLocalDaAula(val);
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

      <MarcarAula
        open={marcarAulaOpen}
        onClose={() => setMarcarAulaOpen(false)}
      />
      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo={"aluno"}
      />

      <aside className="w-64 bg-[#FFFCF0] border-r border-gray-100 flex flex-col p-6 justify-between shrink-0 h-full z-30">
        <div className="mb-10 text-[#1A3B5D] font-black text-xl italic leading-tight uppercase">
          <img src="img/pmlogo.png" alt="Logo" />
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => navigator("/dashboard")}
            className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-50 hover:cursor-pointer transition rounded-lg"
          >
            <People /> Instrutores
          </button>
          <button className="hover:cursor-pointer flex items-center gap-3 w-full p-3 bg-[#FFF9C4] text-gray-700 rounded-l-full font-semibold border-l-4 border-yellow-500">
            <CalendarMonth /> Agendar Aulas
          </button>
          <button
            onClick={() => navigator("/dashboard-aulas")}
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

            <div className="relative z-10 p-10">
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
                                className={`${isSelected ? "bg-green-100" : laneIndex === 1 ? "bg-sky-200" : "bg-orange-300"} h-20 flex justify-center pt-4 transition-colors`}
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
                                  className={`text-xs font-bold uppercase ${isSelected ? "text-green-600" : laneIndex === 1 ? "text-sky-500" : "text-orange-500"}`}
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
                                    setInstrutorSelecao(true);
                                  }}
                                  className={`mt-4 w-full py-2 text-white rounded-full text-[10px] font-bold shadow-md hover:cursor-pointer transition-colors ${
                                    isSelected
                                      ? "bg-green-500"
                                      : laneIndex === 1
                                        ? "bg-sky-400"
                                        : "bg-orange-400"
                                  }`}
                                >
                                  {isSelected ? "Selecionado ✓" : "Selecionar"}
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
              ? "w-110 relative"
              : "absolute inset-0 w-full h-full bg-gray-50/30"
          }`}
        >
          <motion.div
            layout
            className="bg-white border border-gray-100 rounded-4xl p-6 shadow-2xl w-full max-w-sm flex flex-col justify-between min-h-115"
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
                      <DateCalendar
                        value={dataSelecionada}
                        onChange={handleDateChange}
                      />
                      {selecionado && instrutorSelecao && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <TimePicker
                            label="Selecione o Horário"
                            value={dataSelecionada}
                            onChange={handleTimeChange}
                            ampm={false}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </LocalizationProvider>
                </div>
              </div>

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
                    className="bg-[#EAA15F] p-3.5 rounded-2xl shadow-lg text-white hover:scale-105 transition active:scale-95 cursor-pointer"
                  >
                    Prosseguir
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );

  // ─────────────────────────────────────────────
  // MOBILE
  // ─────────────────────────────────────────────

  const mobileStepData = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-xl font-extrabold text-gray-800">Escolha a data</h2>
        <p className="text-sm text-gray-400 mt-1">
          Selecione o dia da sua aula
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center px-2">
        <div className="w-full bg-white rounded-2xl shadow-md p-2">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DateCalendar
              value={dataSelecionada}
              onChange={(newDate) => {
                handleDateChange(newDate);
              }}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="p-4">
        <button
          disabled={!selecionado}
          onClick={() => goToStep(1)}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition active:scale-95 ${
            selecionado
              ? "bg-[#EAA15F] hover:bg-[#e09040]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Próximo: Escolher Instrutor →
        </button>
      </div>
    </div>
  );

  const mobileStepInstrutor = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => goToStep(0)}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowBack fontSize="small" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">
            Escolha o instrutor
          </h2>
          <p className="text-sm text-gray-400">
            Disponíveis em {user?.UF || "seu estado"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {skeletonLoading ? (
          <div className="flex flex-col gap-3 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-4 flex items-center gap-4"
              >
                <Skeleton variant="circular" width={52} height={52} />
                <div className="flex-1">
                  <Skeleton width="60%" height={18} />
                  <Skeleton width="40%" height={14} className="mt-1" />
                </div>
                <Skeleton variant="rounded" width={80} height={34} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-3">
            {instrutores.slice(0, exibirLimite).map((instrutor, index) => {
              const isSelected = instrutorSelecionado === instrutor._id;
              const accentColors = [
                "bg-orange-400",
                "bg-sky-400",
                "bg-purple-400",
              ];
              const accent = accentColors[index % 3];
              const accentBorder = [
                "border-orange-400",
                "border-sky-400",
                "border-purple-400",
              ][index % 3];
              const accentText = [
                "text-orange-500",
                "text-sky-500",
                "text-purple-500",
              ][index % 3];

              return (
                <motion.div
                  key={instrutor._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border-2 transition-all ${
                    isSelected
                      ? "border-green-400 bg-green-50"
                      : "border-transparent"
                  }`}
                >
                  <div
                    className={`rounded-full p-[3px] ${isSelected ? "bg-green-400" : accent}`}
                  >
                    <Avatar
                      sx={{ width: 48, height: 48, border: "2px solid white" }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${isSelected ? "text-green-600" : accentText}`}
                    >
                      {instrutor.nome}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {instrutor.cidade}, {instrutor.UF}
                    </p>
                    <p className="text-sm font-extrabold text-gray-700 mt-0.5">
                      {instrutor.valorAula}R$
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setInstrutorSelecionado(instrutor._id);
                      setInstrutorSelecao(true);
                    }}
                    className={`shrink-0 px-4 py-2 rounded-full text-white text-xs font-bold shadow transition active:scale-95 ${
                      isSelected ? "bg-green-500" : accent
                    }`}
                  >
                    {isSelected ? "✓" : "Selecionar"}
                  </button>
                </motion.div>
              );
            })}

            {exibirLimite < instrutores.length && (
              <button
                onClick={() => setExibirLimite((prev) => prev + 6)}
                className="w-full py-3 bg-gray-100 text-gray-500 font-semibold rounded-2xl text-sm mt-2"
              >
                Ver mais instrutores
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          disabled={!instrutorSelecao}
          onClick={() => goToStep(2)}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition active:scale-95 ${
            instrutorSelecao
              ? "bg-[#EAA15F] hover:bg-[#e09040]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Próximo: Escolher Horário →
        </button>
      </div>
    </div>
  );

  const mobileStepHorario = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => goToStep(1)}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowBack fontSize="small" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">
            Escolha o horário
          </h2>
          <p className="text-sm text-gray-400">
            {dataSelecionada.format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <div className="w-full bg-gray-50 rounded-2xl p-4 flex flex-col gap-1 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Resumo
          </p>
          <p className="text-sm text-gray-700">
            📅{" "}
            <span className="font-semibold">
              {dataSelecionada.format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            👤{" "}
            <span className="font-semibold">
              {instrutores.find((i) => i._id === instrutorSelecionado)?.nome ||
                "Instrutor selecionado"}
            </span>
          </p>
        </div>

        <div className="w-full">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <TimePicker
              label="Selecione o Horário"
              value={horarioSelecionado ? dataSelecionada : null}
              onChange={handleTimeChange}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      fontSize: "1.1rem",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          disabled={!horarioSelecionado}
          onClick={() => goToStep(3)}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition active:scale-95 ${
            horarioSelecionado
              ? "bg-[#EAA15F] hover:bg-[#e09040]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Próximo: Escolher Endereço →
        </button>
      </div>
    </div>
  );

  const mobileStepEndereco = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => goToStep(2)}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowBack fontSize="small" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">
            Endereço da aula
          </h2>
          <p className="text-sm text-gray-400">
            Digite onde você quer ter a aula
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-4 gap-4">
        <div className="w-full bg-gray-50 rounded-2xl p-4 flex flex-col gap-1.5 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
            Resumo da aula
          </p>
          <p className="text-sm text-gray-700">
            📅{" "}
            <span className="font-semibold">
              {dataSelecionada.format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            🕐{" "}
            <span className="font-semibold">
              {dataSelecionada.format("HH:mm")}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            👤{" "}
            <span className="font-semibold">
              {instrutores.find((i) => i._id === instrutorSelecionado)?.nome ||
                "Instrutor"}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            💰{" "}
            <span className="font-semibold">
              {
                instrutores.find((i) => i._id === instrutorSelecionado)
                  ?.valorAula
              }
              R$
            </span>
          </p>
        </div>

        <Autocomplete
          fullWidth
          options={sugestoes}
          loading={loadingBusca}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.display_name || ""
          }
          filterOptions={(x) => x}
          noOptionsText="Nenhum endereço encontrado"
          loadingText="Buscando..."
          onInputChange={(event, newInputValue) => {
            setInputEndereco(newInputValue);
            setLocalDaAula(newInputValue);
            buscarEndereco(newInputValue);
          }}
          onChange={(event, newValue) => {
            const val = newValue ? newValue.display_name : inputEndereco;
            setLocalDaAula(val);
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
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "16px" },
              }}
            />
          )}
        />
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          disabled={!localDaAula || loading}
          onClick={() => marcarAula()}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2 ${
            localDaAula && !loading
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "✓ Confirmar Agendamento"
          )}
        </button>
      </div>
    </div>
  );

  const mobileSteps = [
    mobileStepData,
    mobileStepInstrutor,
    mobileStepHorario,
    mobileStepEndereco,
  ];

  const mobileLayout = (
    <div className="md:hidden flex flex-col h-screen bg-white font-['Inter'] overflow-hidden">
      {/* Header mobile */}
      <div className="bg-[#FFFCF0] border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0">
        <img src="img/pmlogo.png" alt="Logo" className="h-8 object-contain" />
        <Avatar
          onClick={() => setPerfilOpen(true)}
          sx={{ width: 36, height: 36, cursor: "pointer" }}
        />
      </div>

      <div className="px-4 py-3 shrink-0 bg-white border-b border-gray-50">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < mobileStep
                      ? "bg-green-500 text-white"
                      : i === mobileStep
                        ? "bg-[#EAA15F] text-white shadow-md scale-110"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < mobileStep ? "✓" : i + 1}
                </div>
                <span
                  className={`text-[9px] font-semibold ${i === mobileStep ? "text-[#EAA15F]" : i < mobileStep ? "text-green-500" : "text-gray-300"}`}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${i < mobileStep ? "bg-green-400" : "bg-gray-100"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={mobileStep}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col"
          >
            {mobileSteps[mobileStep]}
          </motion.div>
        </AnimatePresence>
      </div>

  <div className=" bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-3 z-50">
          <button
            onClick={() => navigator("/dashboard")}
            className="flex flex-col items-center text-gray-600 text-xs"
          >
            <People /> Instrutores
          </button>
          <button
            className="flex flex-col items-center text-gray-600 text-xs"
          >
            <CalendarMonth /> Agendar
          </button>
          <button onClick={()=>navigator("/dashboard-aulas")} className="flex flex-col items-center text-gray-600 text-xs">
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

      

      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo={"aluno"}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {desktopLayout}
      {mobileLayout}
    </motion.div>
  );
}

export default DashboardMarcar;
