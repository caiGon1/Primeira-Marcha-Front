import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react";
import "@fontsource/inter";
import { Button, List, ListItem } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Profile from "../components/Profile";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Skeleton } from "@mui/material";

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

  useEffect(() => {
    const fetchAulasComAluno = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (!token || !id) return;

      try {
        setSkeletonLoading(true);
        const res = await axios.get(
          `https://primeira-marcha-backend.vercel.app/aulas/instrutor/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const aulas = res.data;

        const aulasComAluno = await Promise.all(
          aulas.map(async (aula) => {
            try {
              const alunoRes = await axios.get(
                `https://primeira-marcha-backend.vercel.app/aluno/${aula.aluno}`,
                { headers: { Authorization: `Bearer ${token}` } },
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      console.log(token);
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    } finally {
      setLoadingAceitar(false);
      window.location.reload();
    }
  };

  const handleAccept = (aulaId) => {
    aceitarAula(aulaId);
  };

  const handleReject = (aulaId) => {
    rejeitarAula(aulaId);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo="instrutor"
      />

      <header className="flex gap-3 justify-center border-b pb-4">
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            navigator("/");
          }}
        >
          Logout
        </Button>
        <Button onClick={() => setPerfilOpen(true)}>Perfil</Button>
      </header>

      <Box className="flex flex-col md:flex-row gap-10 justify-center p-3">
        <Box className="border rounded-lg p-4 min-w-75">
          <h2 className="text-xl font-bold mb-4 text-center">
            Aulas agendadas
          </h2>
          <List className="flex flex-col gap-2">
            {skeletonLoading ? (
              [1, 2, 3].map((n) => (
                <ListItem
                  key={n}
                  className="border-b flex justify-between gap-4 items-center py-4"
                >
                  <Stack className="flex-1">
                    <Box className="flex items-center gap-2 mb-1">
                      <Skeleton variant="text" width={100} height={25} />
                      <Skeleton variant="rounded" width={70} height={20} />
                    </Box>
                    <Skeleton variant="text" width="50%" height={20} />
                    <Skeleton variant="text" width="70%" height={20} />
                  </Stack>

                  {/* Simula os dois botões: Rejeitar e Aceitar */}
                  <Box className="flex gap-2">
                    <Skeleton variant="text" width={60} height={30} />
                    <Skeleton variant="text" width={60} height={30} />
                  </Box>
                </ListItem>
              ))
            ) : aulasAgendadas.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma aula agendada</p>
            ) : (
              aulasAgendadas.map((aula, index) => (
                <ListItem
                  key={index}
                  className="border-b flex justify-between gap-4 items-center py-4"
                >
                  <Stack className="flex-1">
                    <div>
                      <strong className="mr-2 text-lg">{aula.nomeAluno}</strong>
                      <span
                        className={`capitalize font-bold ${statusColors[aula.statusAula?.toLowerCase()]} text-sm`}
                      >
                        {aula.statusAula?.toLowerCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {dayjs(aula.dataInicio).format("DD/MM/YYYY HH:mm")}
                      <br />
                      {aula.localAula}
                    </span>
                  </Stack>

                  <Box className="flex gap-2">
                    <Button
                      color="error"
                      variant="text"
                      onClick={() => handleReject(aula._id)}
                    >
                      {loadingRejeitar ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Rejeitar"
                      )}
                    </Button>
                    <Button
                      color="success"
                      variant="text"
                      onClick={() => handleAccept(aula._id)}
                    >
                      {loadingAceitar ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Aceitar"
                      )}
                    </Button>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Box>
    </div>
  );
}

export default DashboardInstrutor;
