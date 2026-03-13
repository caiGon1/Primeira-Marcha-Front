import { useNavigate } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import * as React from 'react';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

function Dashboard() {
  const navigator = useNavigate();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Lidos"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon/> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Não lidos"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <MarkEmailUnreadIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <header className="flex gap-3 justify-center">
        <button onClick={() => navigator("/")}>Logout</button>
        <button>Perfil</button>
        <button>Notificações</button>
        <ChatIcon onClick={toggleDrawer(true)}></ChatIcon>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
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
