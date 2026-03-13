import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/material";


function Login() {
  const navigator = useNavigate();

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Box className="p-4 rounded flex gap-2 w-fit flex-col items-center justify-center  border-2 border-gray-400">
        <h1>Login</h1>
        <form className="flex flex-col gap-2" action="/dashboard" method="post">
          <div className="grid grid-rows-2 gap-2">

            <TextField
              id="outlined-email-input"
              label="Email"
              type="email"
              autoComplete="email "
            />

            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <button
            onClick={() => navigator("/dashboard")}
            className="border-2 rounded border-gray-400"
            type="submit"
          >
            Login
          </button>
        </form>
      </Box>
    </div>
  );
}

export default Login;
