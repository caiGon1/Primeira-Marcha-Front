import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import ChatIcon from "@mui/icons-material/Chat";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import MeuDrawer from "../components/MeuDrawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Button, DialogTitle } from "@mui/material";

function Dashboard() {
  const navigator = useNavigate();

  const [openMenu, setMenuOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [horariosOpen, setHorariosOpen] = React.useState(false);
  const [professorOpen, setProfessorOpen] = React.useState(false);

  const handleSubmit = (e) => { 
    e.preventDefault();
  }


  return (


    <div className="h-full w-full flex flex-col gap-4 p-4">
      <MeuModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <p>Este é o conteúdo do modal.</p>
      </MeuModal>

      <MeuModal open={horariosOpen} onClose={() => setHorariosOpen(false)}>
        <DialogTitle>Selecione um dia e horário para você!</DialogTitle>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker/>
          <TimePicker defaultValue={dayjs} />
        </LocalizationProvider>
          <Button onClick={() => setHorariosOpen(false) || setProfessorOpen(true) } className="mt-2" variant="outlined" color="neutral">Procurar um professor</Button>
      </MeuModal>

      <MeuModal open={professorOpen} onClose={()=> setProfessorOpen(false)}>
        <DialogTitle>Professores disponíveis</DialogTitle>
        <ul>
          <li>Professor 1 <Button>Agendar</Button></li>
          <li>Professor 2 <Button>Agendar</Button></li>
          <li>Professor 3 <Button>Agendar</Button></li>
        </ul>
      </MeuModal>

      <MeuDrawer openMenu={openMenu} setOpenMenu={setMenuOpen} />

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
        <button onClick={() => setHorariosOpen(true)} className="p-2 border-2 rounded w-fit h-fit">
          Agendar uma aula
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
