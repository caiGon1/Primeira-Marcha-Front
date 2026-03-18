import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import MeuDrawer from "../components/MeuDrawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Button, DialogTitle } from "@mui/material";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

function DashboardInstrutor() {
  const navigator = useNavigate();
  const [openMenu, setMenuOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

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
          <DatePicker disablePast />
          <TimePicker disablePast defaultValue={null} />
          até
          <DatePicker disablePast />
          <TimePicker disablePast defaultValue={null} />
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
            console.log(values.value); // "1500" (sem formatação)
            console.log(values.floatValue); // 1500 (number)
          }}
        />
        <Button variant="contained">Criar disponibilidade</Button>
      </MeuModal>

      <header className="flex gap-3 justify-center">
        <button onClick={() => navigator("/")}>Logout</button>
        <button onClick={() => setModalOpen(true)}>Perfil</button>
        <button>Notificações</button>
        <ChatIcon onClick={() => setMenuOpen(true)} />
      </header>
      <div className="flex flex-row gap-10 justify-center p-3">
        <div className="h-fit w-fit">
          <h1>Proximas Aulas</h1>
          <ul className="flex flex-col gap-2 border-2 rounded p-2">
            <li>
              Aula1 <button>Cancelar</button>
            </li>
            <li>
              Aula2 <button>Cancelar</button>
            </li>
            <li>
              Aula3 <button>Cancelar</button>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setHorariosOpen(true)}
          className="p-2 border-2 rounded w-fit h-fit"
        >
          Criar uma aula
        </button>
      </div>
    </div>
  );
}

export default DashboardInstrutor;
