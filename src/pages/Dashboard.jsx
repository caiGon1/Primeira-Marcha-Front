import { useNavigate } from "react-router-dom";

function Dashboard() {
      const navigator = useNavigate();

    return (<div className="h-full w-full flex flex-col gap-4 p-4">
        <header className="flex gap-3 justify-center">
            <button onClick={() => navigator('/')}>Logout</button>
            <button>Perfil</button>
            <button>Notificações</button>
            <button>Chat</button>
        </header>
        <div className="grid">
            <h1>Proximas Aulas</h1>
            <button>Agendar uma aula</button>
            <ul className="flex flex-col gap-2 border-2 rounded h-fit w-fit p-2">
                <li>Aula1 <button>Cancelar</button></li>
                <li>Aula2 <button>Cancelar</button></li>
                <li>Aula3 <button>Cancelar</button></li>
            </ul>
        </div>
        <div>
        </div>
    </div> );
}

export default Dashboard;