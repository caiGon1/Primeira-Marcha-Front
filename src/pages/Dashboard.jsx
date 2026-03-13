import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigator = useNavigate();

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <header className="flex gap-3 justify-center">
        <button onClick={() => navigator("/")}>Logout</button>
        <button>Perfil</button>
        <button>Notificações</button>
        <button>Chat</button>
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
        <button className="p-2 border-2 rounded w-fit h-fit">Agendar uma aula</button>
      </div>
    </div>
  );
}

export default Dashboard;
