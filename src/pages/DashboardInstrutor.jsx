import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ChatIcon from "@mui/icons-material/Chat";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import MeuDrawer from "../components/MeuDrawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, DialogTitle, List } from "@mui/material";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { ListItem } from "@mui/material";
import { Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";


function DashboardInstrutor() {
  const tomorrow = dayjs().add(1, "day");
  const navigator = useNavigate();
  const [openMenu, setMenuOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [value1, setValue1] = React.useState(dayjs(null));
  const [value2, setValue2] = React.useState(dayjs(null));
  const [value3, setValue3] = React.useState("");
  const [aulas, setAulas] = React.useState([]);

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <MeuModal openModal={modalOpen} setOpenModal={setModalOpen} />
      <MeuDrawer openMenu={openMenu} setOpenMenu={setMenuOpen} />
      <MeuModal open={horariosOpen} onClose={() => setHorariosOpen(false)}>
        <DialogTitle>
          Selecione o dia e horário disponíveis para aula
        </DialogTitle>
        Estou disponível para aulas em:
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Dia & Horário"
            value={value1}
            onChange={(newValue) => setValue1(newValue)}
            disablePast
            slotProps={{
              textField: {
                error: false,
              },
            }}
          />
          até
          <DateTimePicker
            minDate={tomorrow}
            disablePast
            label="Dia & Horário"
            value={value2}
            onChange={(newValue) => setValue2(newValue)}
            slotProps={{
              textField: {
                error: false,
              },
            }}
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
          onValueChange={(values) => {
            setValue3(values.floatValue);
          }}
        />
        <Button
          onClick={() => {
            setAulas([...aulas, { dia1: value1, dia2: value2, preco: value3 }]);
            setHorariosOpen(false);
          }}
          variant="contained"
        >
          Criar disponibilidade
        </Button>
      </MeuModal>

      <header className="flex gap-3 justify-center">
        <Button onClick={() => navigator("/")}>Logout</Button>
        <Button onClick={() => setModalOpen(true)}>Perfil</Button>
        <Button>Notificações</Button>
        <ChatIcon onClick={() => setMenuOpen(true)} />
      </header>
      <div className="flex flex-row gap-10 justify-center p-3">
        <div className="h-fit w-fit">
          <h1>Aulas Criadas</h1>
          <List className="flex flex-col gap-2 border-2 rounded p-2">
            {aulas.length === 0 ? (
              <p className="text-center">Nenhuma aula criada</p>
            ) : (
              aulas.map((aula, index) => (
                <ListItem
                  key={index}
                  className="flex flex-row gap-2 justify-between"
                >
                  <Stack
                    direction="row"
                    gap={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {aula.dia1.format("DD/MM/YYYY HH:mm")} até{" "}
                    {aula.dia2.format("DD/MM/YYYY HH:mm")} - R$ {aula.preco} por
                    aula
                  </Stack>
                  <Button>
                    <Delete
                      onClick={() => {
                        const newAulas = [...aulas];
                        newAulas.splice(index, 1);
                        setAulas(newAulas);
                      }}
                    />
                  </Button>
                </ListItem>
              ))
            )}
          </List>
        </div>
        <Button 
          variant="outlined"
          color="neutral"
          onClick={() => setHorariosOpen(true)}
          className="p-2 border-2 rounded w-fit h-fit"
        >
          Criar uma aula
        </Button>
      </div>
    </div>
  );
}

export default DashboardInstrutor;
