import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import * as React from "react";
import "@fontsource/inter";
import MeuModal from "../components/MeuModal";
import MeuDrawer from "../components/MeuDrawer";

function Dashboard() {
  const navigator = useNavigate();

const [openMenu, setMenuOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);


  

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <MeuModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <p>Este é o conteúdo do modal.</p>
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
        <button className="p-2 border-2 rounded w-fit h-fit">
          Agendar uma aula
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
