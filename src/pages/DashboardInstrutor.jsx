import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, DialogTitle, List, ListItem, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { NumericFormat } from "react-number-format";
import { Delete } from "@mui/icons-material";
import Profile from "../components/Profile";
import { useEffect } from "react";
import axios from "axios";

function DashboardInstrutor() {
  const tomorrow = dayjs().add(1, "day");
  const navigator = useNavigate();
  const [perfilOpen, setPerfilOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [value1, setValue1] = React.useState(dayjs(null));
  const [value2, setValue2] = React.useState(dayjs(null));
  const [value3, setValue3] = React.useState("");
  const [aulas, setAulas] = React.useState([]);

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <Profile
        open={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        tipo="instrutor"
      />

      {/* Modal ajustado para ter espaçamento consistente */}
      <MeuModal open={horariosOpen} onClose={() => setHorariosOpen(false)}>
        <DialogTitle>Disponibilidade de Aula</DialogTitle>
        <Stack spacing={3} sx={{ p: 2 }}>
          <p className="text-gray-600">
            Selecione o intervalo de horário e o preço:
          </p>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Início"
              value={value1}
              onChange={(newValue) => setValue1(newValue)}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DateTimePicker
              label="Término"
              minDate={tomorrow}
              disablePast
              value={value2}
              onChange={(newValue) => setValue2(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <NumericFormat
            customInput={TextField}
            label="Preço por aula"
            variant="outlined"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values) => setValue3(values.floatValue)}
            fullWidth
          />

          <Button
            onClick={() => {
              setAulas([
                ...aulas,
                { dia1: value1, dia2: value2, preco: value3 },
              ]);
              setHorariosOpen(false);
            }}
            variant="contained"
            fullWidth
          >
            Criar disponibilidade
          </Button>
        </Stack>
      </MeuModal>

      {/* Header padronizado */}
      <header className="flex gap-3 justify-center border-b pb-4">
        <Button onClick={() => navigator("/")}>Logout</Button>
        <Button onClick={() => setPerfilOpen(true)}>Perfil</Button>
      </header>

      {/* Layout principal alinhado com o Dashboard do Aluno */}
      <Box className="flex flex-col md:flex-row gap-10 justify-center p-3">
        {/* Coluna de Listagem */}
        <Box className="border rounded-lg p-4 min-w-75">
          <h2 className="text-xl font-bold mb-4 text-center">Aulas Criadas</h2>
          <List className="flex flex-col gap-2">
            {aulas.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma aula criada</p>
            ) : (
              aulas.map((aula, index) => (
                <ListItem
                  key={index}
                  className="border-b flex justify-between gap-4 items-center"
                >
                  <Stack>
                    <strong>R$ {aula.preco} / aula</strong>
                    <span className="text-sm">
                      {aula.dia1.format("DD/MM HH:mm")} até{" "}
                      {aula.dia2.format("HH:mm")}
                    </span>
                  </Stack>
                  <Button
                    color="error"
                    onClick={() => {
                      const newAulas = [...aulas];
                      newAulas.splice(index, 1);
                      setAulas(newAulas);
                    }}
                  >
                    <Delete />
                  </Button>
                </ListItem>
              ))
            )}
          </List>
        </Box>

        {/* Coluna de Ações (Botões Laterais) */}
        <Stack direction="column" gap={2} justifyContent="center">
          <Button
            onClick={() => setHorariosOpen(true)}
            variant="outlined"
            size="large"
          >
            Criar uma aula
          </Button>
          {/* Espaço para outros botões que o instrutor possa ter futuramente */}
        </Stack>
      </Box>
    </div>
  );
}

export default DashboardInstrutor;
