import { useState } from "react";
import axios from "axios";
import * as React from "react";
import MeuModal from "./MeuModal";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Snackbar, Alert } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "@fontsource/inter";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";

function ReagendaAula({ open, onClose, aulaId }) {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    endereco: "",
    dataHora: null,
  });

  const reagendarAula = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) return;
    try {
      setLoading(true);
      await axios.patch(
        `https://primeira-marcha-backend.vercel.app/aula/${aulaId}/reagendar`,
        {
          dataInicio: formData.dataHora,
          dataFinal: formData.dataHora,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Aula reagendada com sucesso!");
      setAlertOpen(true);
    } catch (error) {
      alert("Erro ao reagendar aula.");
      console.log(error.response ? error.response.data : error.message);
    } finally {
        setLoading(false);
        window.location.reload();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    reagendarAula();
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert severity="success">
          Aula reagendada, espere a confirmação de seu instrutor!
        </Alert>
      </Snackbar>

      <MeuModal open={open} onClose={onClose}>
        <DialogTitle>Digite o novo horário</DialogTitle>
        <form action="">
          <Stack gap={3} sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Data e Hora"
                disablePast={true}
                value={formData.dataHora}
                onChange={(newValue) => {
                  setFormData({ ...formData, dataHora: newValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reagendar Aula"
              )}
            </Button>
          </Stack>
        </form>
      </MeuModal>
    </>
  );
}

export default ReagendaAula;
