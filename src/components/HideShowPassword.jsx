import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function HideShowPassword({ label = "Senha", value, onChange, name }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      required
      label={label}
      value={value}
      onChange={(e) =>
        onChange({
          target: {
            name,
            value: e.target.value,
          },
        })
      }
      type={showPassword ? "text" : "password"}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}